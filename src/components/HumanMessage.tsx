import type { MessageResponse } from "@/types/message";
import { UserIcon } from "lucide-react";
import { getMessageContent } from "@/services/messageUtils";

interface HumanMessageProps {
  message: MessageResponse;
}

export const HumanMessage = ({ message }: HumanMessageProps) => {
  return (
    <div className="flex justify-end animate-in fade-in duration-300">
      <div className="flex max-w-[85%] gap-4">
        <div className="flex-1 pt-0.5">
          <div className="rounded-2xl bg-[#F4F4F4] px-4 py-3 text-[13px] leading-relaxed text-[#2D2D2D] font-normal">
            {getMessageContent(message)}
          </div>
        </div>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-[#5D5D5A] text-white">
          <UserIcon className="h-4 w-4" strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
};
