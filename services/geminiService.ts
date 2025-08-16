import { GoogleGenAI, GenerateContentParameters, Part, Tool, Type, Content } from "@google/genai";
import { ChatMessage, Persona, TaskStep } from "../types";

// Ensure the API key is available from environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const WORKSPACE_TOOLS: Tool = {
  functionDeclarations: [
    {
      name: 'createFile',
      description: 'Creates a new file in the workspace with the given name and code content.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          fileName: { type: Type.STRING, description: 'The name of the file to create, including the extension.' },
          code: { type: Type.STRING, description: 'The initial code content for the file.' },
        },
        required: ['fileName', 'code'],
      },
    },
    {
      name: 'updateFile',
      description: 'Updates the content of an existing file. Use this to add, remove, or change code.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          fileName: { type: Type.STRING, description: 'The name of the file to update.' },
          code: { type: Type.STRING, description: 'The new, complete code content for the file.' },
        },
        required: ['fileName', 'code'],
      },
    },
    {
      name: 'listFiles',
      description: 'Returns a list of all files currently in the workspace.',
      parameters: {
        type: Type.OBJECT,
        properties: {},
        required: [],
      },
    },
    {
      name: 'generateTestFile',
      description: 'Generates a test file for a given source file using a specified framework (e.g., jest). Creates a new file like `source.test.js`.',
      parameters: {
          type: Type.OBJECT,
          properties: {
              fileName: { type: Type.STRING, description: "The name of the source file to generate tests for (e.g., 'utils.js')." },
              framework: { type: Type.STRING, description: "The testing framework to use, (e.g., 'jest', 'mocha'). Defaults to 'jest'." },
          },
          required: ['fileName'],
      }
    }
  ],
};

const WIDGET_TOOLS: Tool = {
  functionDeclarations: [
    {
      name: 'createWidget',
      description: 'Creates a new UI widget based on a user prompt.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          prompt: { type: Type.STRING, description: 'A detailed description of the widget to create.' },
        },
        required: ['prompt'],
      },
    },
    {
      name: 'updateWidget',
      description: 'Updates an existing UI widget based on a new prompt.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          widgetId: { type: Type.STRING, description: 'The ID of the widget to update.' },
          newPrompt: { type: Type.STRING, description: 'A new, complete description of the widget that incorporates the requested changes.' },
        },
        required: ['widgetId', 'newPrompt'],
      },
    },
  ]
};


const generateSystemInstruction = (
    persona: Persona, 
    isWebAccessEnabled: boolean,
    isCostSaverMode: boolean,
    isDeepAnalysis: boolean,
    customInstruction: string,
): string => {
  const customInstructionSegment = customInstruction 
    ? `CRITICAL USER-DEFINED INSTRUCTION: You MUST follow this directive in all responses: "${customInstruction}"`
    : "";

  const webAccessInfo = isWebAccessEnabled ? "Web access is enabled. Use Google Search for current info and cite sources." : "Web access is disabled.";
  
  const brevityInstruction = isCostSaverMode
    ? "Priority: EXTREME BREVITY. Your responses must be as concise as possible, ideally 1-3 sentences. Avoid conversational filler."
    : "Provide comprehensive, natural, and supportive responses.";

  const analysisMode = isDeepAnalysis
    ? "CRITICAL: DEEP ANALYSIS MODE. You are to provide expert-level, highly detailed, and comprehensive responses. Think step-by-step and break down complex topics thoroughly. Use your full knowledge base."
    : brevityInstruction;

  return `${persona.system_prompt_segment}

${customInstructionSegment}

Core Directives:
1.  **Formatting**: Always use markdown for formatting, especially for code blocks and links.
2.  **Web Access**: ${webAccessInfo}
3.  **Response Style**: ${analysisMode}`;
};

export const streamMentorXResponse = (
  history: ChatMessage[],
  persona: Persona,
  isWebAccessEnabled: boolean,
  isCostSaverMode: boolean,
  isDeepAnalysis: boolean,
  customInstruction: string,
  filePart: Part | null | undefined,
  modelParams: { temperature?: number, topP?: number, topK?: number }
) => {
  try {
    const systemInstruction = generateSystemInstruction(persona, isWebAccessEnabled, isCostSaverMode, isDeepAnalysis, customInstruction);
    
    const contents: Content[] = history.map(msg => {
      const parts: Part[] = [];
      if (msg.text && msg.role !== 'tool') {
          parts.push({ text: msg.text });
      }
      
      if (msg.attachment && msg.role === 'user') {
          parts.push({ inlineData: { mimeType: msg.attachment.type, data: msg.attachment.data } });
      }

      if (msg.role === 'tool' && msg.toolResponses) {
        msg.toolResponses.forEach(toolResponse => {
            parts.push({ 
                functionResponse: {
                    name: toolResponse.functionName,
                    response: toolResponse.response
                }
            });
        })
      }

      return {
        role: msg.role === 'assistant' ? 'model' : msg.role === 'tool' ? 'function' : 'user',
        parts: parts.filter(p => p != null),
      };
    });

    if (filePart) {
      const lastUserContent = contents.slice().reverse().find(c => c.role === 'user');
      if (lastUserContent) {
        lastUserContent.parts.push(filePart);
      }
    }

    const params: GenerateContentParameters = {
        model: "gemini-2.5-flash",
        contents,
        config: {
            systemInstruction: systemInstruction,
            temperature: modelParams.temperature ?? (isDeepAnalysis ? 0.5 : 0.7),
            topP: modelParams.topP ?? 0.95,
            ...(modelParams.topK && { topK: modelParams.topK }),
        },
    };
    
    const toolsToUse: any[] = [];
    if (isWebAccessEnabled) {
        toolsToUse.push({googleSearch: {}});
    }
    if (persona.id === 'gamedev' || persona.id === 'sandbox' || persona.system_prompt_segment.includes('Code Sandbox')) {
        toolsToUse.push(WORKSPACE_TOOLS);
    }
    if (persona.id === 'widget_factory') {
        toolsToUse.push(WIDGET_TOOLS);
    }
    
    if (toolsToUse.length > 0) {
        params.config!.tools = toolsToUse;
    }

    return ai.models.generateContentStream(params);

  } catch (error) {
    console.error("Error preparing stream from Gemini API:", error);
    throw error;
  }
};


export const generateMentorXImage = async (prompt: string, aspectRatio: string = '1:1', numberOfImages: number = 1): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: {
        numberOfImages: numberOfImages,
        outputMimeType: 'image/jpeg',
        aspectRatio: aspectRatio,
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageUrls = response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
      return base64ImageUrls;
    } else {
      throw new Error("No image was generated by the API.");
    }
  } catch (error)
  {
    console.error("Error generating image with Gemini API:", error);
    throw new Error("Failed to generate image. The model might have refused the prompt for safety reasons.");
  }
};

export const generatePromptForImageEditing = async (modificationPrompt: string, image: { data: string, mimeType: string }): Promise<string> => {
    const systemPrompt = `You are an expert prompt engineer for a generative AI model that creates images.
Your task is to take a user's existing image and a textual modification request, and then generate a new, comprehensive, and self-contained prompt that describes the *entire* modified scene.
The new prompt must incorporate the user's changes while preserving the style, composition, and key elements of the original image.
Do not just state the change. Create a full prompt as if you were generating the image from scratch.
Respond ONLY with the new prompt text. Do not add any conversational filler or explanations.`;

    const imagePart = { inlineData: { mimeType: image.mimeType, data: image.data } };
    const textPart = { text: `Modification request: "${modificationPrompt}"` };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.2,
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating prompt for image editing:", error);
        throw new Error("The AI failed to create a new prompt for your image edit.");
    }
};

export const classifyPromptIntent = async (prompt: string): Promise<'chat' | 'image_generation'> => {
    const systemPrompt = `You are an intent classification AI. Your task is to analyze the user's prompt and determine if they want to have a conversation or generate an image.
- If the prompt is asking to draw, create, generate, or show a picture, photo, or image of something, the intent is 'image_generation'.
- For all other conversational prompts (questions, requests for code, text, etc.), the intent is 'chat'.
Respond ONLY with the JSON object.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User prompt: "${prompt}"`,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        intent: {
                            type: Type.STRING,
                            enum: ['chat', 'image_generation']
                        }
                    },
                    required: ['intent']
                }
            }
        });

        const json = JSON.parse(response.text);
        return json.intent || 'chat';
    } catch (error) {
        console.error("Error classifying prompt intent:", error);
        // Default to 'chat' on error to be safe
        return 'chat';
    }
};


export const getAiCodeSuggestion = async (code: string, language: string, action: 'refactor' | 'debug' | 'document' | 'explain' | 'test', framework?: string): Promise<string> => {
    let actionVerb = action === 'document' ? 'add documentation to' : action;
    if (action === 'test') {
        actionVerb = `generate unit tests for, using the ${framework || 'jest'} framework. The response must be only the code for the test file.`
    }

    const prompt = `Task: You are an expert programmer. Your task is to ${actionVerb} the following ${language} code.
IMPORTANT: Respond ONLY with the complete, modified code inside a single markdown code block. Do not add any conversational text, headings, or explanations before or after the code block.

\`\`\`${language}
${code}
\`\`\``;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text;
        const match = text.match(/```(?:\w+)?\n([\s\S]+?)\n```/);
        
        return match ? match[1].trim() : text.trim();

    } catch (error) {
        console.error(`Error performing AI code action (${action}):`, error);
        throw new Error(`The AI failed to process the code action. ${error instanceof Error ? error.message : ''}`);
    }
};

export const getWorkspaceAnalysis = async (fileList: string[]): Promise<string[]> => {
    const prompt = `You are a senior software architect. Given this list of files in a project: [${fileList.join(', ')}], provide 3 actionable, high-level suggestions for improvement (e.g., "Refactor player.js to use a state machine", "Add unit tests for utils.js", "Combine CSS into a single stylesheet").`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ['suggestions']
                }
            }
        });
        const json = JSON.parse(response.text);
        return json.suggestions || [];
    } catch (error) {
        console.error("Error getting workspace analysis:", error);
        throw new Error("Failed to analyze workspace.");
    }
};

export const generateTaskPlan = async (goal: string): Promise<Omit<TaskStep, 'id' | 'status'>[]> => {
    const prompt = `You are a task planning AI. Your goal is to break down a user's request into a concrete, step-by-step plan of function calls.
User Request: "${goal}"

You must respond with a JSON array of objects, where each object represents a single step. Each step must be a single call to one of the available functions.

Available Functions:
- \`createFile(fileName: string, code: string)\`: Creates a new file.
- \`updateFile(fileName:string, code: string)\`: Replaces the entire content of a file.
- \`generateTestFile(fileName: string, framework: string)\`: Creates a test file for an existing file.
- \`listFiles()\` : Lists all files in the workspace.

Example: If the user says "create an html file", your response should be:
[
  {
    "description": "Create the main HTML file.",
    "toolCall": { "function": { "name": "createFile", "arguments": { "fileName": "index.html", "code": "<!DOCTYPE html><html><body><h1>Hello!</h1></body></html>" } } }
  }
]
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: { type: Type.STRING, description: "A short, user-facing description of the step." },
                            toolCall: {
                                type: Type.OBJECT,
                                properties: {
                                    "function": {
                                        type: Type.OBJECT,
                                        properties: {
                                            name: { type: Type.STRING },
                                            arguments: { type: Type.OBJECT }
                                        },
                                        required: ['name', 'arguments']
                                    }
                                },
                                required: ['function']
                            }
                        },
                        required: ['description', 'toolCall']
                    }
                }
            }
        });

        const plan = JSON.parse(response.text);
        return plan;
    } catch (error) {
        console.error("Error generating task plan:", error);
        throw new Error("I was unable to create a plan for that request.");
    }
};

export const generateAiWidget = async (prompt: string): Promise<string> => {
    const fullPrompt = `You are a React JSX generator. Your task is to create a single, self-contained React functional component based on the user's prompt.

    **CRITICAL RULES:**
    1.  Respond ONLY with the raw JSX code for the component.
    2.  Do NOT include \`import React from 'react';\` or any other imports.
    3.  Do NOT wrap the code in markdown code blocks (e.g., \`\`\`jsx ... \`\`\`).
    4.  The component must be a functional component or a single JSX element.
    5.  Use Tailwind CSS classes for styling. All necessary Tailwind classes are available.
    6.  The component must be self-contained. It cannot rely on external state or props.
    7.  For dynamic data like time, use placeholders that can be filled, or generate static content. Example: 'new Date().toLocaleTimeString()' is fine.
    8.  Example output for "a simple button": \`<button className="p-2 bg-blue-500 rounded text-white">Click Me</button>\`

    User Prompt: "${prompt}"
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });
        
        let jsx = response.text.trim();
        // Clean up potential markdown fences that the model might add despite instructions.
        if (jsx.startsWith('```jsx')) {
            jsx = jsx.substring(5, jsx.length - 3).trim();
        } else if (jsx.startsWith('```')) {
            jsx = jsx.substring(3, jsx.length - 3).trim();
        }
        
        return jsx;
    } catch (error) {
        console.error("Error generating AI widget:", error);
        throw new Error("The AI failed to generate the widget.");
    }
};