import type { MessageResponse } from "@/types/message";
import { UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMessageContent } from "@/services/messageUtils";

interface HumanMessageProps {
  message: MessageResponse;
}

export const HumanMessage = ({ message }: HumanMessageProps) => {
  return (
    <div className="flex justify-end gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="max-w-[80%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-md",
            "bg-gradient-to-br from-blue-600 to-indigo-600 text-white",
            "border border-blue-500/30",
            "backdrop-blur-sm",
            "dark:from-blue-700 dark:to-indigo-700",
          )}
        >
          <div className="prose prose-invert max-w-none dark:prose-invert">
            <p className="my-0 leading-relaxed">{getMessageContent(message)}</p>
          </div>
        </div>
      </div>
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
        <UserIcon className="h-5 w-5 text-white" />
      </div>
    </div>
  );
};
