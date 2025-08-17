import { ChatMessage, Persona, TaskStep } from "../types";

// The base URL for the backend API. It's empty for local dev, but set for production.
const API_BASE = (window as any).mentorx_config?.BACKEND_URL || '';

/**
 * A helper function to handle API requests to the backend, with consistent error handling.
 */
async function postToApi<T>(endpoint: string, body: object): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `Server error: ${response.status}` }));
      throw new Error(errorData.error || `An unknown server error occurred.`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`Error calling endpoint ${endpoint}:`, error);
    throw error;
  }
}


/**
 * Streams a chat response from the backend server.
 * This function is an async generator that yields parsed JSON chunks from the server-sent event stream.
 */
export async function* streamMentorXResponse(
  history: ChatMessage[],
  persona: Persona,
  isWebAccessEnabled: boolean,
  isCostSaverMode: boolean,
  isDeepAnalysis: boolean,
  customInstruction: string,
  modelParams: { temperature?: number, topP?: number, topK?: number }
): AsyncGenerator<any, void, unknown> {
  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
        },
        body: JSON.stringify({
            history,
            persona,
            isWebAccessEnabled,
            isCostSaverMode,
            isDeepAnalysis,
            customInstruction,
            modelParams
        })
    });

    if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error("Failed to get response reader");
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the last partial line in the buffer

        for (const line of lines) {
            if (line.startsWith('data:')) {
                const jsonString = line.substring(5).trim();
                if (jsonString) {
                    const chunk = JSON.parse(jsonString);
                     if (chunk.error) {
                        throw new Error(chunk.message);
                    }
                    yield chunk;
                }
            }
        }
    }
  } catch (error) {
    console.error("Error streaming response from backend:", error);
    throw error;
  }
}

/**
 * Generates an image by calling the backend image generation endpoint.
 */
export const generateMentorXImage = async (prompt: string, aspectRatio: string = '1:1', numberOfImages: number = 1): Promise<string[]> => {
  const data = await postToApi<{ images: string[] }>('/api/image', { prompt, aspectRatio, numberOfImages });
  return data.images;
};

/**
 * Generates a new image prompt for editing an existing image.
 */
export const generatePromptForImageEditing = async (modificationPrompt: string, image: { data: string, mimeType: string }): Promise<string> => {
    const { prompt } = await postToApi<{ prompt: string }>('/api/image-prompt', { modificationPrompt, image });
    return prompt;
};

/**
 * Classifies the user's prompt as either 'chat' or 'image_generation'.
 */
export const classifyPromptIntent = async (prompt: string): Promise<'chat' | 'image_generation'> => {
    const { intent } = await postToApi<{ intent: 'chat' | 'image_generation' }>('/api/classify-intent', { prompt });
    return intent;
};

/**
 * Gets an AI-powered code suggestion from the backend.
 */
export const getAiCodeSuggestion = async (code: string, language: string, action: 'refactor' | 'debug' | 'document' | 'explain' | 'test', framework?: string): Promise<string> => {
    const { suggestion } = await postToApi<{ suggestion: string }>('/api/code-suggestion', { code, language, action, framework });
    return suggestion;
};

/**
 * Gets an AI analysis of the current workspace from the backend.
 */
export const getWorkspaceAnalysis = async (fileList: string[]): Promise<string[]> => {
    const { suggestions } = await postToApi<{ suggestions: string[] }>('/api/workspace-analysis', { fileList });
    return suggestions;
};

/**
 * Generates a step-by-step task plan from a user's goal.
 */
export const generateTaskPlan = async (goal: string): Promise<Omit<TaskStep, 'id' | 'status'>[]> => {
    const { plan } = await postToApi<{ plan: Omit<TaskStep, 'id' | 'status'>[] }>('/api/task-plan', { goal });
    return plan;
};

/**
 * Generates a React JSX widget from a prompt.
 */
export const generateAiWidget = async (prompt: string): Promise<string> => {
    const { jsx } = await postToApi<{ jsx: string }>('/api/widget', { prompt });
    return jsx;
};
