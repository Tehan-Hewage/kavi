"use client";

import React, { useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface MessageListProps {
  messages: ChatMessage[];
  isThinking?: boolean;
  onOpenDetails?: (productId: string) => void;
  onSelectCategory?: (slug: string, name: string) => void;
  onSubmitCheckout?: (details: any) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isThinking = false,
  onOpenDetails,
  onSelectCategory,
  onSubmitCheckout,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const lastMessage = messages[messages.length - 1];
  const activeToolName = lastMessage?.isToolThinking ? lastMessage.toolThinkingName : undefined;

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 no-scrollbar">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onOpenDetails={onOpenDetails}
          onSelectCategory={onSelectCategory}
          onSubmitCheckout={onSubmitCheckout}
        />
      ))}
      
      <TypingIndicator show={isThinking} toolName={activeToolName} />
      
      <div ref={bottomRef} />
    </div>
  );
};
export default MessageList;
