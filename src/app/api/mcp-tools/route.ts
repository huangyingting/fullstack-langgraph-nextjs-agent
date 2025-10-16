import { NextResponse } from "next/server";
import { getMCPTools } from "@/lib/agent/mcp";
import { MCPToolsData, MCPToolsGrouped } from "@/types/mcp";

export async function GET() {
  try {
    const tools = await getMCPTools();

    if (!Array.isArray(tools) || tools.length === 0) {
      return NextResponse.json({
        serverGroups: {},
        totalCount: 0,
      } as MCPToolsData);
    }

    const serverGroups: MCPToolsGrouped = {};

    for (const tool of tools) {
      // Type guard: ensure tool is an object with name property
      if (!tool || typeof tool !== 'object' || !('name' in tool)) {
        continue;
      }
      
      // Extract server name from tool name (assumes format: "servername__toolname")
      const toolName = (tool as Record<string, unknown>).name || "unknown";
      if (typeof toolName !== 'string') {
        continue;
      }
      
      const parts = toolName.split("__");
      const serverName = parts.length > 1 ? parts[0] : "default";
      const cleanToolName = parts.length > 1 ? parts.slice(1).join("__") : toolName;

      if (!serverGroups[serverName]) {
        serverGroups[serverName] = {
          tools: [],
          count: 0,
        };
      }

      const description = (tool as Record<string, unknown>).description;
      serverGroups[serverName].tools.push({
        name: cleanToolName,
        description: typeof description === 'string' ? description : undefined,
      });
      serverGroups[serverName].count++;
    }

    return NextResponse.json({
      serverGroups,
      totalCount: tools.length,
    } as MCPToolsData);
  } catch (error) {
    console.error("Error fetching MCP tools:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch MCP tools",
        serverGroups: {},
        totalCount: 0,
      },
      { status: 500 },
    );
  }
}
