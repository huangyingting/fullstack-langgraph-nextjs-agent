import { DEFAULT_SYSTEM_PROMPT as SYSTEM_PROMPT } from "./prompt";
import { sqliteCheckpointer } from "./memory";
import type { DynamicTool, StructuredToolInterface } from "@langchain/core/tools";
import {
  AgentConfigOptions,
  createChatModel,
} from "./util";
import { getMCPTools } from "./mcp";
import { AgentBuilder } from "./builder";
let setupPromise: Promise<void> | null = null;

/**
 * One-time initialization for the SQLite checkpointer.
 * Ensures the underlying table/extension are ready before any agent runs.
 * This is called automatically when creating an agent via `getAgent` or `ensureAgent`.
 */
async function setupOnce() {
  if (!setupPromise) {
    setupPromise = (async () => {
      try {
        // SqliteSaver setup is synchronous and protected, but the instance
        // initializes automatically when created via fromConnString
        return;
      } catch (err) {
        // Reset so a future call can retry if initial setup failed.
        setupPromise = null;
        console.error("Failed to setup sqlite checkpointer:", err);
        throw err;
      }
    })();
  }
  await setupPromise;
}

/**
 * Create a new agent instance with the given configuration.
 * @param cfg Configuration options for the agent
 * @returns
 */
async function createAgent(cfg?: AgentConfigOptions) {
  // Create Azure OpenAI model from environment configuration
  const llm = createChatModel({ temperature: 1 });

  // Load MCP tools
  const mcpTools = await getMCPTools();
  const configTools = (cfg?.tools || []) as StructuredToolInterface[];
  
  // Ensure mcpTools is an array before spreading
  const mcpToolsArray = Array.isArray(mcpTools) ? mcpTools : [];
  const allTools = [...configTools, ...mcpToolsArray] as DynamicTool[];

  const agent = new AgentBuilder({
    llm,
    tools: allTools,
    prompt: cfg?.systemPrompt || SYSTEM_PROMPT,
    checkpointer: sqliteCheckpointer,
    approveAllTools: cfg?.approveAllTools || false,
  }).build();

  return agent;
}

// Public helper if explicit readiness is ever needed elsewhere.
export async function ensureAgent(cfg?: AgentConfigOptions) {
  // Ensure checkpointer is ready before returning an agent instance.
  await setupOnce();
  return createAgent(cfg);
}

// Named export to explicitly fetch a configured agent.
export async function getAgent(cfg?: AgentConfigOptions) {
  return ensureAgent(cfg);
}

// Eagerly create a default agent at module load using env defaults.
export const defaultAgent = await ensureAgent();
