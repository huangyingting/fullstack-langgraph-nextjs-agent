import { ChevronDown, ChevronUp, Sliders, Brain, Wrench } from "lucide-react";
import { useState } from "react";
import { ModelConfiguration } from "./ModelConfiguration";
import { useMCPTools } from "@/hooks/useMCPTools";

interface SidebarSettingsProps {
  provider: string;
  setProvider: (provider: string) => void;
  model: string;
  setModel: (model: string) => void;
  onOpenMCPConfig: () => void;
}

export function SidebarSettings({
  provider,
  setProvider,
  model,
  setModel,
  onOpenMCPConfig,
}: SidebarSettingsProps) {
  const [isModelExpanded, setIsModelExpanded] = useState(false);
  const [isMCPExpanded, setIsMCPExpanded] = useState(false);
  const { data: mcpToolsData } = useMCPTools();

  return (
    <div className="space-y-3 border-t border-gray-200/50 px-2 py-4 dark:border-gray-800/50">
      {/* Settings Header */}
      <div className="px-3 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <Sliders className="h-3.5 w-3.5" />
          Configuration
        </div>
      </div>

      {/* Model Configuration Section */}
      <div className="space-y-1.5 rounded-lg border border-blue-200/40 bg-gradient-to-br from-blue-50/60 via-blue-50/30 to-transparent p-3 shadow-sm dark:border-blue-900/40 dark:from-blue-950/40 dark:via-blue-950/20 dark:to-transparent">
        <button
          onClick={() => setIsModelExpanded(!isModelExpanded)}
          className="flex w-full items-center justify-between rounded-md px-2 py-1.5 transition-all hover:bg-blue-100/50 dark:hover:bg-blue-900/20"
        >
          <div className="flex items-center gap-2">
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
              <Brain className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">AI Model</span>
          </div>
          {isModelExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-600 transition-transform dark:text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-600 transition-transform dark:text-gray-400" />
          )}
        </button>

        {isModelExpanded && (
          <div className="animate-in slide-in-from-top-2 space-y-3 border-t border-blue-200/30 pt-3 duration-200 dark:border-blue-900/30">
            <ModelConfiguration
              provider={provider}
              setProvider={setProvider}
              model={model}
              setModel={setModel}
            />
          </div>
        )}
      </div>

      {/* MCP Servers Section */}
      <div className="space-y-1.5 rounded-lg border border-purple-200/40 bg-gradient-to-br from-purple-50/60 via-purple-50/30 to-transparent p-3 shadow-sm dark:border-purple-900/40 dark:from-purple-950/40 dark:via-purple-950/20 dark:to-transparent">
        <button
          onClick={() => setIsMCPExpanded(!isMCPExpanded)}
          className="flex w-full items-center justify-between rounded-md px-2 py-1.5 transition-all hover:bg-purple-100/50 dark:hover:bg-purple-900/20"
        >
          <div className="flex items-center gap-2">
            <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-purple-100 dark:bg-purple-900/30">
              <Wrench className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">MCP Servers</span>
            {(mcpToolsData?.totalCount ?? 0) > 0 && (
              <span className="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-600/20 text-xs font-bold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                {mcpToolsData?.totalCount ?? 0}
              </span>
            )}
          </div>
          {isMCPExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-600 transition-transform dark:text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-600 transition-transform dark:text-gray-400" />
          )}
        </button>

        {isMCPExpanded && (
          <div className="animate-in slide-in-from-top-2 space-y-2 border-t border-purple-200/30 pt-3 duration-200 dark:border-purple-900/30">
            <button
              onClick={onOpenMCPConfig}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600/20 to-purple-600/10 px-3 py-2 text-xs font-semibold text-purple-700 transition-all hover:from-purple-600/30 hover:to-purple-600/20 hover:shadow-md dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-300 dark:hover:from-purple-500/30 dark:hover:to-purple-500/20"
            >
              Manage Servers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
