import type { MessageResponse } from "@/types/message";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMessageContent } from "@/services/messageUtils";

interface ErrorMessageProps {
  message: MessageResponse;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/20">
        <AlertTriangle className="h-5 w-5 text-white" />
      </div>
      <div className="max-w-[80%]">
        <div
          className={cn(
            "rounded-2xl border border-red-400/30 bg-gradient-to-br from-red-50 to-rose-50/50 px-4 py-3 text-red-900 shadow-md dark:border-red-900/30 dark:from-red-950/40 dark:to-rose-950/30 dark:text-red-200",
          )}
        >
          <p className="m-0 text-sm whitespace-pre-wrap leading-relaxed">{getMessageContent(message)}</p>
        </div>
      </div>
    </div>
  );
};
