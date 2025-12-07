// src/lib/ai-models.ts
import { openai } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// --- 1. Configure Providers ---
const deepseek = createOpenAICompatible({
  name: "deepseek",
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/",
  includeUsage: true,
});

const google = createOpenAICompatible({
  name: "gemini-openaiFormat",
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// --- 2. Define the Model Registry (The Backend Logic) ---
// Using a Record object is cleaner than a switch statement
export const modelRegistry = {
  "gpt-5-mini": openai("gpt-5-mini"),
  "deepseek-chat": deepseek("deepseek-chat"),
  "gemini-2.5-flash": google("models/gemini-2.5-flash"),
};

// --- 3. TypeScript Magic ---
// This extracts the keys automatically: 'gpt-4o' | 'deepseek-chat' | ...
// If you add a new model above, this type updates automatically!
export type ModelId = keyof typeof modelRegistry;

// --- 4. Define UI Data (The Frontend Logic) ---
// We export this so the dropdown menu is always in sync with the available models
export const availableModels: { id: ModelId; label: string }[] = [
  { id: "gpt-5-mini", label: "gpt-5-mini (OpenAI)" },
  { id: "deepseek-chat", label: "DeepSeek V3.2" },
  { id: "gemini-2.5-flash", label: "gemini-2.5-flash" },
];
