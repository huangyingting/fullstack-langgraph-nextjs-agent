import { BaseMessage } from "@langchain/core/messages";
import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";
import * as dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV !== "test") {
  dotenv.config();
}

/**
 * Creates a SqliteSaver instance using environment variables
 * @returns SqliteSaver instance
 */
export function createSqliteMemory(): SqliteSaver {
  let dbPath = process.env.DATABASE_URL?.replace("file:", "") || "./langgraph.db";
  
  // Convert relative paths to absolute paths based on the prisma folder
  if (!path.isAbsolute(dbPath)) {
    const prismaDir = path.join(process.cwd(), "prisma");
    dbPath = path.resolve(prismaDir, dbPath);
  }
  
  return SqliteSaver.fromConnString(dbPath);
}

/**
 * Retrieves the message history for a specific thread.
 * @param threadId - The ID of the thread to retrieve history for.
 * @returns An array of messages associated with the thread.
 */
export const getHistory = async (threadId: string): Promise<BaseMessage[]> => {
  const history = await sqliteCheckpointer.get({
    configurable: { thread_id: threadId },
  });
  return Array.isArray(history?.channel_values?.messages) ? history.channel_values.messages : [];
};

export const sqliteCheckpointer = createSqliteMemory();
