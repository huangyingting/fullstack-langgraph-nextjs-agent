import { ChatOpenAI, AzureChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export interface CreateChatModelOptions {
  provider?: string; // 'openai' | 'google' | 'azure-openai' | others later
  model: string;
  temperature?: number;
}

/**
 * Central factory for creating a chat model based on provider + model name.
 */
export function createChatModel({
  provider = "google",
  model,
  temperature = 1,
}: CreateChatModelOptions): BaseChatModel {
  switch (provider) {
    case "openai":
      return new ChatOpenAI({ model, temperature });
    case "azure-openai":
      return new AzureChatOpenAI({
        // Use deployment name from env, or model parameter as fallback  
        azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME || model,
        temperature,
        azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
        azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
        // Explicitly set streaming to false to avoid potential iterator issues
        streaming: false,
      });
    case "google":
    default:
      return new ChatGoogleGenerativeAI({ model, temperature });
  }
}
export interface AgentConfigOptions {
  model?: string;
  provider?: string; // 'google' | 'openai' | 'azure-openai' etc.
  systemPrompt?: string; // system prompt override
  tools?: unknown[]; // tools from registry or direct tool objects
  approveAllTools?: boolean; // if true, skip tool approval prompts
}

export const DEFAULT_MODEL_PROVIDER = "google";
export const DEFAULT_MODEL_NAME = "gemini-2.5-flash";
