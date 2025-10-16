import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { ArrowUp, Loader2, Eye, EyeOff } from "lucide-react";
import { MessageOptions } from "@/types/message";
import { useUISettings } from "@/contexts/UISettingsContext";

interface MessageInputProps {
  onSendMessage: (message: string, opts?: MessageOptions) => Promise<void>;
  isLoading?: boolean;
  maxLength?: number;
}

export const MessageInput = ({
  onSendMessage,
  isLoading = false,
  maxLength = 2000,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [approveAllTools, setApproveAllTools] = useState<boolean>(false);

  // UI settings for toggling tool messages
  const { hideToolMessages, toggleToolMessages } = useUISettings();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [message]);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    await onSendMessage(message, {
      tools: [],
      approveAllTools: approveAllTools,
    });
    setMessage("");
  };
  // Calculate remaining characters
  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars < maxLength * 0.1; // Less than 10% remaining
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={`relative flex flex-col rounded-xl border transition-all duration-200 ${
          isFocused ? "border-black/15 shadow-sm" : "border-black/10"
        } bg-white`}
      >
        {/* Input Section */}
        <div className="px-4 pt-3 pb-2">
          <textarea
            value={message}
            ref={textareaRef}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={"Type your message..."}
            className="max-h-[200px] min-h-[48px] w-full flex-1 resize-none overflow-auto bg-transparent text-[15px] leading-relaxed text-[#2D2D2D] placeholder-[#A0A0A0] focus:outline-none"
            rows={1}
            aria-label="Message input"
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Character counter */}
              <div className={`text-xs ${isNearLimit ? "text-amber-600" : "text-[#8E8E8E]"}`}>
                {remainingChars}/{maxLength}
              </div>

              {/* Auto-approve tools setting */}
              <label className="flex cursor-pointer items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={approveAllTools}
                  onChange={(e) => setApproveAllTools(e.target.checked)}
                  className="h-3.5 w-3.5 cursor-pointer rounded border-black/20 text-[#AB6B3C] focus:ring-1 focus:ring-[#AB6B3C]/30"
                />
                <span className="text-xs text-[#5D5D5A]">Auto-approve tools</span>
              </label>

              {/* Tool messages toggle */}
              <button
                type="button"
                onClick={toggleToolMessages}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors hover:bg-black/5"
                aria-label={hideToolMessages ? "Show tool messages" : "Hide tool messages"}
              >
                {hideToolMessages ? (
                  <EyeOff className="h-3.5 w-3.5 text-[#8E8E8E]" />
                ) : (
                  <Eye className="h-3.5 w-3.5 text-[#8E8E8E]" />
                )}
                <span className="text-[#5D5D5A]">
                  {hideToolMessages ? "Show tools" : "Hide tools"}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={!message.trim() || isLoading}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-0 transition-all ${
                  message.trim() && !isLoading ? "bg-[#AB6B3C] hover:bg-[#96593A] text-white" : "bg-black/5 text-[#A0A0A0]"
                }`}
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
