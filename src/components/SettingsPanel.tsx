import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { ModelConfiguration } from "./ModelConfiguration";
import { useMCPTools } from "@/hooks/useMCPTools";

interface SettingsPanelProps {
  isExpanded: boolean;
  onToggle: () => void;
  provider: string;
  setProvider: (provider: string) => void;
  model: string;
  setModel: (model: string) => void;
}

export const SettingsPanel = ({
  isExpanded,
  onToggle,
  provider,
  setProvider,
  model,
  setModel,
}: SettingsPanelProps) => {
  const { data: mcpToolsData } = useMCPTools();
  return (
    <div className="border-b border-gray-200/50 bg-gradient-to-r from-gray-50/30 to-blue-50/20 dark:border-gray-800/50 dark:from-gray-900/30 dark:to-blue-950/20">
      {/* Settings Header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-all hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
        aria-expanded={isExpanded}
        aria-label="Toggle settings panel"
      >
        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-semibold">Settings</span>
          {!isExpanded && (
            <>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {provider} • {model}
              </span>
              {(mcpToolsData?.totalCount ?? 0) > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {mcpToolsData?.totalCount ?? 0}
                </span>
              )}
            </>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500 transition-transform" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500 transition-transform" />
        )}
      </button>

      {/* Settings Content */}
      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 border-t border-gray-200/50 px-4 py-4 duration-200 dark:border-gray-800/50">
          <div className="space-y-4">
            {/* Model Configuration */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                AI Model
              </label>
              <ModelConfiguration
                provider={provider}
                setProvider={setProvider}
                model={model}
                setModel={setModel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
