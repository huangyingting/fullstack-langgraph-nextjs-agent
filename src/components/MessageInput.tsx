import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { ArrowUp, Loader2, Eye, EyeOff } from "lucide-react";
import { MessageOptions } from "@/types/message";
import { useModelSettings } from "@/contexts/ModelSettingsContext";
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

  // Get model settings from context
  const { provider, model } = useModelSettings();

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
      provider,
      model,
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
        className={`relative mx-auto flex max-w-2xl flex-col rounded-2xl border transition-all duration-300 ${
          isFocused ? "border-blue-400 shadow-lg shadow-blue-500/20" : "border-gray-200/50"
        } bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-700/50`}
      >
        {/* Input Section */}
        <div className="px-4 pt-4 pb-2">
          <textarea
            value={message}
            ref={textareaRef}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={"Type your message..."}
            className="max-h-[200px] min-h-[60px] w-full flex-1 resize-none overflow-auto bg-transparent pr-12 text-gray-900 placeholder-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder-gray-500"
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
              <div className={`text-xs font-medium ${isNearLimit ? "text-amber-500" : "text-gray-400"}`}>
                {remainingChars}/{maxLength}
              </div>

              {/* Auto-approve tools setting - always visible */}
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={approveAllTools}
                  onChange={(e) => setApproveAllTools(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Auto-approve tools</span>
              </label>

              {/* Tool messages toggle */}
              <button
                type="button"
                onClick={toggleToolMessages}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={hideToolMessages ? "Show tool messages" : "Hide tool messages"}
              >
                {hideToolMessages ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
                <span className="text-gray-600 dark:text-gray-400">
                  {hideToolMessages ? "Show tools" : "Hide tools"}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={!message.trim() || isLoading}
                className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg p-0 transition-all ${
                  message.trim() && !isLoading ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 text-white" : "bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-600"
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
