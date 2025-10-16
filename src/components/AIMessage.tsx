import type { MessageResponse, ToolApprovalCallbacks } from "@/types/message";
import { Bot } from "lucide-react";
import rehypeKatex from "rehype-katex";
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
    <div className="-mx-6 bg-[#F9F9F8] px-6 py-4">
      <div className="flex gap-4 animate-in fade-in duration-300 items-start">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[#E8A87C] to-[#D4915A] text-white">
          <Bot className="h-4 w-4" strokeWidth={2.5} />
        </div>
        <div className="flex-1 space-y-2">
        {messageContent && (
          <div className="prose prose-stone max-w-none">
            <div
              data-color-mode="light"
              className="text-[13px] leading-relaxed text-[#2D2D2D] [&_hr]:!my-4 [&_hr]:border-black/10 [&_li]:my-1 [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc [&_a]:text-[#AB6B3C] [&_a]:underline [&_a]:decoration-[#AB6B3C]/30 [&_a]:underline-offset-2 hover:[&_a]:decoration-[#AB6B3C] [&_code]:bg-black/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[12px] [&_code]:font-mono [&_code]:text-[#2D2D2D] [&_pre]:bg-[#2D2D2D] [&_pre]:text-white [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-white [&_h1]:text-[18px] [&_h1]:font-semibold [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-[16px] [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-[14px] [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:my-1 [&_strong]:font-semibold"
            >
              <MDEditor.Markdown
                source={messageContent}
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  padding: 0,
                  fontSize: "inherit",
                  fontFamily: "inherit",
                }}
                rehypePlugins={[rehypeKatex]}
              />
            </div>
          </div>
        )}

        {shouldShowTools && (
          <div className="space-y-1">
            <ToolCallDisplay
              toolCalls={toolCalls}
              approvalCallbacks={approvalCallbacks}
              showApprovalButtons={showApprovalButtons}
            />
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
