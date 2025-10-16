"use client";
import { MessageInput } from "./MessageInput";
import MessageList from "./MessageList";
import { useChatThread } from "@/hooks/useChatThread";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { MessageOptions } from "@/types/message";

interface ThreadProps {
  threadId: string;
  onFirstMessageSent?: (threadId: string) => void;
}

export const Thread = ({ threadId, onFirstMessageSent }: ThreadProps) => {
  const { messages, isLoadingHistory, isSending, sendMessage, approveToolExecution } =
    useChatThread({ threadId });
  const firstMessageInitiatedRef = useRef(false);
  const [awaitingFirstResponse, setAwaitingFirstResponse] = useState(false);

  const handleSendMessage = async (message: string, opts?: MessageOptions) => {
    const wasEmpty = messages.length === 0;
    await sendMessage(message, opts);
    if (wasEmpty) {
      firstMessageInitiatedRef.current = true;
      setAwaitingFirstResponse(true);
    }
  };

  // Detect first AI/tool/error message arrival after initial user message to trigger redirect
  useEffect(() => {
    if (awaitingFirstResponse && !isSending) {
      const hasNonHuman = messages.some((m) => m.type !== "human");
      if (hasNonHuman) {
        setAwaitingFirstResponse(false);
        if (onFirstMessageSent) onFirstMessageSent(threadId);
      }
    }
  }, [awaitingFirstResponse, isSending, messages, onFirstMessageSent, threadId]);

  if (isLoadingHistory) {
    return (
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 absolute inset-0 flex items-center justify-center backdrop-blur">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <p className="text-muted-foreground mt-2">Loading conversation history...</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col">
      {messages.length > 0 ? (
        <>
          <div className="min-h-0 flex-1">
            <ScrollArea className="h-full">
              <div className="mx-auto max-w-3xl px-6">
                <MessageList messages={messages} approveToolExecution={approveToolExecution} />
              </div>
            </ScrollArea>
          </div>
          <div className="flex-shrink-0 border-t border-black/[0.06]">
            <div className="w-full py-4">
              <div className="mx-auto max-w-3xl px-6">
                <MessageInput onSendMessage={handleSendMessage} isLoading={isSending} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-3xl px-6">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-medium text-[#2D2D2D]">
                How can I help you today?
              </h1>
              <p className="mt-2 text-[15px] text-[#5D5D5A]">
                Start a conversation to explore what I can do
              </p>
            </div>
            <MessageInput onSendMessage={handleSendMessage} isLoading={isSending} />
          </div>
        </div>
      )}
    </div>
  );
};
