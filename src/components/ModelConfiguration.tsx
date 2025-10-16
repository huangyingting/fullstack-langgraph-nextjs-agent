"use client";

import { useEffect, useRef, useState } from "react";
import { BrainCog, Loader2, Wrench } from "lucide-react";
import Image from "next/image";
import { useMCPTools } from "@/hooks/useMCPTools";
import { MCPToolsTooltip } from "./MCPToolsTooltip";

interface ModelConfigurationProps {
  provider: string;
  setProvider: (provider: string) => void;
  model: string;
  setModel: (model: string) => void;
  approveAllTools?: boolean;
  setApproveAllTools?: (approveAllTools: boolean) => void;
  compact?: boolean;
}

export const ModelConfiguration = ({
  provider,
  setProvider,
  model,
  setModel,
  compact = true,
}: ModelConfigurationProps) => {
  const [showMCPTooltip, setShowMCPTooltip] = useState(false);
  const editContainerRef = useRef<HTMLDivElement | null>(null);
  const mcpTooltipRef = useRef<HTMLDivElement | null>(null);

  // Fetch MCP tools data
  const { data: mcpToolsData, isLoading: mcpToolsLoading } = useMCPTools();

  // Hide MCP tooltip when clicking outside
  useEffect(() => {
    if (!showMCPTooltip) return;
    function handler(e: MouseEvent) {
      if (
        showMCPTooltip &&
        mcpTooltipRef.current &&
        !mcpTooltipRef.current.contains(e.target as Node)
      ) {
        setShowMCPTooltip(false);
      }
    }
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [showMCPTooltip]);

  return (
    <div className={compact ? "space-y-2" : "space-y-4"} ref={editContainerRef}>
      {/* Provider Selection */}
      <div className="space-y-1.5">
        <label className={`block font-medium ${compact ? "text-xs text-gray-600 dark:text-gray-400" : "text-sm text-gray-700 dark:text-gray-300"}`}>
          Provider
        </label>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
            <Image
              src={`/${provider === "azure-openai" ? "openai" : provider.toLowerCase()}.svg`}
              alt={provider}
              width={20}
              height={20}
              className="object-contain p-0.5"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            {provider === "azure-openai" && (
              <BrainCog className="h-3.5 w-3.5" />
            )}
          </span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className={`flex-1 rounded-md border border-gray-300 bg-white/80 ${compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"} transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-200`}
          >
            <option value="google">Google</option>
            <option value="openai">OpenAI</option>
            <option value="azure-openai">Azure OpenAI</option>
          </select>
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-1.5">
        <label className={`block font-medium ${compact ? "text-xs text-gray-600 dark:text-gray-400" : "text-sm text-gray-700 dark:text-gray-300"}`}>
          Model
        </label>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder={compact ? "gpt-4o-mini" : "Enter model name"}
          className={`w-full rounded-md border border-gray-300 bg-white/80 ${compact ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"} transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-200 dark:placeholder:text-gray-500`}
        />
      </div>

      {/* MCP Tools Display */}
      {!compact && (mcpToolsData?.totalCount ?? 0) > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            MCP Tools
          </label>
          <div className="flex items-center gap-2">
            {mcpToolsLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading tools...</span>
              </div>
            ) : (
              <div className="relative" ref={mcpTooltipRef}>
                <button
                  type="button"
                  onClick={() => setShowMCPTooltip(!showMCPTooltip)}
                  className="flex items-center gap-2 rounded border border-gray-300 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                  aria-label={`${mcpToolsData?.totalCount ?? 0} MCP tools available`}
                >
                  <Wrench className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {mcpToolsData?.totalCount ?? 0} tools available
                  </span>
                </button>
                {mcpToolsData && (
                  <MCPToolsTooltip
                    data={mcpToolsData}
                    isVisible={showMCPTooltip}
                    className="bottom-full left-0 mb-2"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
