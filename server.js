import express from 'express';
import { GoogleGenAI, Type } from "@google/genai";
import path from 'path';
import { fileURLToPath } from 'url';

// --- SERVER SETUP ---
const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// --- CORS MIDDLEWARE ---
// This is crucial for allowing your frontend (hosted on a different domain like GitHub Pages)
// to communicate with this backend server. It tells the browser that requests from any origin are allowed.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any domain
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow these methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept'); // Allow these headers

  // Handle the browser's preflight 'OPTIONS' request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

app.use(express.json({ limit: '50mb' }));

// --- SERVE STATIC FILES ---
// This serves all the frontend files (index.html, index.tsx, etc.) from the root directory.
app.use(express.static(path.join(__dirname, '.')));


// --- RESILIENT GEMINI API SETUP ---
// This setup allows the server to run even if the API_KEY is missing.
const API_KEY = process.env.API_KEY;
let ai;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  // We log a warning but DO NOT exit the process. This prevents the server from crashing.
  console.warn("WARNING: API_KEY environment variable is not set. The server will run, but API endpoints will be unavailable and return a 503 error.");
}
const model = "gemini-2.5-flash";


// --- API KEY CHECK MIDDLEWARE ---
// This middleware runs before all /api/ routes. If the Gemini client (`ai`) wasn't initialized
// because the key was missing, it sends a clear error message back to the frontend.
const checkApiKey = (req, res, next) => {
    if (!ai) {
        // Use 503 Service Unavailable, as the server is running but can't fulfill its purpose.
        return res.status(503).json({ error: 'Service Unavailable: The server is missing the required API_KEY configuration.' });
    }
    next();
};

// --- API HELPER ---
const sendError = (res, message, status = 500) => {
    console.error(`API Error: ${message}`);
    // Check if headers have been sent to avoid "Cannot set headers after they are sent to the client" error
    if (!res.headersSent) {
        res.status(status).json({ error: message });
    }
};

// Apply the API key check middleware to all /api routes
app.use('/api', checkApiKey);


// --- API ENDPOINTS ---

/**
 * Main streaming chat endpoint.
 */
app.post('/api/chat', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        const { history, persona, isWebAccessEnabled, isCostSaverMode, isDeepAnalysis, customInstruction, modelParams } = req.body;
        const systemInstruction = generateSystemInstruction(persona, isWebAccessEnabled, isCostSaverMode, isDeepAnalysis, customInstruction);
        
        // Convert message history to the format expected by the Gemini API
        const contents = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : msg.role,
            parts: [{ text: msg.text }],
        }));

        const params = {
            model,
            contents,
            config: {
                systemInstruction,
                temperature: modelParams.temperature ?? (isDeepAnalysis ? 0.5 : 0.7),
                topP: modelParams.topP ?? 0.95,
                ...(modelParams.topK && { topK: modelParams.topK }),
                ...(isWebAccessEnabled && { tools: [{ googleSearch: {} }] }),
            },
        };
        const result = await ai.models.generateContentStream(params);

        for await (const chunk of result) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
    } catch (error) {
        console.error('Error in /api/chat:', error);
        res.write(`data: ${JSON.stringify({ error: true, message: error.message })}\n\n`);
    } finally {
        if (!res.writableEnded) {
            res.end();
        }
    }
});

/**
 * Image generation endpoint.
 */
app.post('/api/image', async (req, res) => {
    try {
        const { prompt, aspectRatio, numberOfImages } = req.body;
        const response = await ai.models.generateImages({
            // FIX: Updated model to 'imagen-4.0-generate-001' per coding guidelines.
            model: 'imagen-4.0-generate-001',
            prompt,
            config: { numberOfImages, outputMimeType: 'image/jpeg', aspectRatio },
        });

        if (response.generatedImages?.length > 0) {
            const urls = response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
            res.json({ images: urls });
        } else {
            throw new Error("No image was generated by the API.");
        }
    } catch (error) {
        sendError(res, "Failed to generate image. The model might have refused the prompt for safety reasons.");
    }
});

/**
 * All-purpose, non-streaming text generation endpoint
 */
async function generateText(req, res, contents, config = {}) {
     try {
        const response = await ai.models.generateContent({ model, contents, ...config });
        return response.text;
    } catch (error) {
        sendError(res, `Failed to generate text: ${error.message}`);
        return null;
    }
}

app.post('/api/code-suggestion', async (req, res) => {
    const { code, language, action } = req.body;
    const prompt = `Action: ${action} the following ${language} code. IMPORTANT: Respond ONLY with the raw code, without any markdown formatting or explanation.\n\nCODE:\n${code}`;
    const suggestion = await generateText(req, res, prompt);
    if (suggestion) res.json({ suggestion });
});

app.post('/api/workspace-analysis', async (req, res) => {
    const { fileList } = req.body;
    const prompt = `Analyze this file structure and suggest 3 high-level improvements or next steps. File list: ${fileList.join(', ')}`;
    const config = {
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
      }
    };
    const responseJson = await generateText(req, res, prompt, config);
    if (responseJson) res.send(responseJson);
});


app.post('/api/task-plan', async (req, res) => {
    const { goal } = req.body;
    const prompt = `Create a step-by-step plan to achieve this programming goal: "${goal}". The user has tools like createFile, updateFile.`;
    const config = {
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                },
              },
            },
          },
        },
      }
    };
    const responseJson = await generateText(req, res, prompt, config);
    if (responseJson) res.send(responseJson);
});

app.post('/api/widget', async (req, res) => {
    const { prompt } = req.body;
    const fullPrompt = `Generate a single React JSX component as a string for this prompt: "${prompt}". Use TailwindCSS for styling. The component must be self-contained. Respond ONLY with the raw JSX, starting with a div or fragment.`;
    const jsx = await generateText(req, res, fullPrompt);
    if (jsx) res.json({ jsx: jsx.replace(/```jsx\n|```/g, '').trim() });
});

app.post('/api/image-prompt', async (req, res) => {
    const { modificationPrompt, image } = req.body;
    const contents = { parts: [
      { inlineData: { mimeType: image.mimeType, data: image.data } },
      { text: `Based on the attached image, create a new detailed, photorealistic image prompt that incorporates this modification: "${modificationPrompt}". The new prompt should describe the entire scene.` }
    ]};
    const prompt = await generateText(req, res, contents);
    if (prompt) res.json({ prompt });
});

app.post('/api/classify-intent', async (req, res) => {
    const { prompt } = req.body;
    const fullPrompt = `Is the user's primary intent "image_generation" or "chat"? Respond with ONLY one of those two options. User prompt: "${prompt}"`;
    const intent = await generateText(req, res, fullPrompt, { config: { temperature: 0 } });
    if (intent) res.json({ intent: intent.trim().toLowerCase().includes('image') ? 'image_generation' : 'chat' });
});


// --- CATCH-ALL ROUTE ---
// This serves the index.html for any request that doesn't match an API route or a static file.
// It's essential for single-page applications.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// --- START SERVER ---
app.listen(port, () => {
    console.log(`MentorX server running at http://localhost:${port}`);
    if (!API_KEY) {
        console.log("-------------------------------------------------");
        console.warn("WARNING: API_KEY environment variable is NOT SET.");
        console.warn("The server is running, but API calls will fail with a 503 error.");
        console.warn("Please set the API_KEY in your Render environment settings for full functionality.");
        console.log("-------------------------------------------------");
    }
});

// --- HELPER FUNCTIONS ---
const generateSystemInstruction = (persona, isWebAccessEnabled, isCostSaverMode, isDeepAnalysis, customInstruction) => {
  const custom = customInstruction ? `CRITICAL USER-DEFINED INSTRUCTION: You MUST follow this directive: "${customInstruction}"` : "";
  const web = isWebAccessEnabled ? "Web access is enabled. Use Google Search for current info and cite sources." : "Web access is disabled.";
  const brevity = isCostSaverMode ? "Priority: EXTREME BREVITY. Be as concise as possible." : "Provide comprehensive, natural responses.";
  const analysis = isDeepAnalysis ? "CRITICAL: DEEP ANALYSIS MODE. Provide expert-level, detailed responses." : brevity;
  return `${persona.system_prompt_segment}\n\n${custom}\n\nCore Directives:\n1. Formatting: Use markdown.\n2. Web Access: ${web}\n3. Response Style: ${analysis}`;
};