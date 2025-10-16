import type { MessageResponse, ToolApprovalCallbacks } from "@/types/message";
import { Bot } from "lucide-react";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";
import { getMessageContent, hasToolCalls, getToolCalls } from "@/services/messageUtils";
import { ToolCallDisplay } from "./ToolCallDisplay";
import { useUISettings } from "@/contexts/UISettingsContext";
import MDEditor from "@uiw/react-md-editor";

interface AIMessageProps {
  message: MessageResponse;
  approvalCallbacks?: ToolApprovalCallbacks;
  showApprovalButtons?: boolean;
}

export const AIMessage = ({
  message,
  approvalCallbacks,
  showApprovalButtons = false,
}: AIMessageProps) => {
  const messageContent = getMessageContent(message);
  const hasTools = hasToolCalls(message);
  const toolCalls = getToolCalls(message);
  const { hideToolMessages } = useUISettings();

  // If tool messages are hidden and there's no text content, don't render anything
  const shouldShowTools = hasTools && !hideToolMessages;
  const hasVisibleContent = messageContent || shouldShowTools;

  if (!hasVisibleContent) {
    return null;
  }

  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
        <Bot className="h-5 w-5 text-white" />
      </div>
      <div className="max-w-[80%] space-y-3">
        {messageContent && (
          <div
            className={cn(
              "rounded-2xl px-4 py-3 shadow-md",
              "bg-gradient-to-br from-gray-50 to-gray-100/50 text-gray-900",
              "border border-gray-200/50",
              "backdrop-blur-sm supports-[backdrop-filter]:bg-gray-50/80",
              "dark:from-gray-800 dark:to-gray-900/50 dark:text-gray-100 dark:border-gray-700/50",
            )}
          >
            <div
              data-color-mode="light"
              className="[&_hr]:!my-2 [&_hr]:h-px [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-gray-300 dark:[&_hr]:border-gray-600 [&_li]:my-1 [&_ol]:ml-6 [&_ol]:list-decimal [&_ul]:ml-6 [&_ul]:list-disc [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:hover:underline [&_code]:bg-gray-200 dark:[&_code]:bg-gray-700 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm"
            >
              <MDEditor.Markdown
                source={messageContent}
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "1rem",
                }}
                rehypePlugins={[rehypeKatex]}
              />
            </div>
          </div>
        )}

        {shouldShowTools && (
          <div className="space-y-2">
            <ToolCallDisplay
              toolCalls={toolCalls}
              approvalCallbacks={approvalCallbacks}
              showApprovalButtons={showApprovalButtons}
            />
          </div>
        )}
      </div>
    </div>
  );
};
