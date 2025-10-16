import { AzureChatOpenAI } from "@langchain/openai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export interface CreateChatModelOptions {
  temperature?: number;
}

/**
 * Create Azure OpenAI chat model using environment configuration.
 */
export function createChatModel({
  temperature = 1,
}: CreateChatModelOptions = {}): BaseChatModel {
  return new AzureChatOpenAI({
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME!,
    temperature,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
    streaming: true,
  });
}

export interface AgentConfigOptions {
  systemPrompt?: string; // system prompt override
  tools?: unknown[]; // tools from registry or direct tool objects
  approveAllTools?: boolean; // if true, skip tool approval prompts
}
