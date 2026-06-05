"use client";

import React, { useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface MessageListProps {
  messages: ChatMessage[];
  isThinking?: boolean;
  isStreaming?: boolean;
  onOpenDetails?: (productId: string) => void;
  onSelectCategory?: (slug: string, name: string) => void;
  onSubmitCheckout?: (details: any) => void;
  activeSpeakingId?: string | null;
  onSpeak?: (text: string, messageId: string) => void;
  ttsError?: string | null;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isThinking = false,
  isStreaming = false,
  onOpenDetails,
  onSelectCategory,
  onSubmitCheckout,
  activeSpeakingId = null,
  onSpeak,
  ttsError = null,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, isThinking, isStreaming]);

  const lastMessage = messages[messages.length - 1];
  const activeToolName = lastMessage?.isToolThinking ? lastMessage.toolThinkingName : undefined;

  const hasRenderableContent = (msg: ChatMessage) => {
    if (!msg) return false;
    if (msg.content && msg.content.trim() !== "") {
      return true;
    }
    if (msg.toolResults && msg.toolResults.length > 0) {
      return msg.toolResults.some((tr) => {
        if (!tr.result) return false;
        if (tr.tool === "kapruka_search_products") {
          const list = tr.result?.results || (Array.isArray(tr.result) ? tr.result : null);
          return list && list.length > 0;
        }
        if (tr.tool === "kapruka_list_categories" || tr.tool === "kapruka_get_categories") {
          const list = tr.result?.categories || tr.result || [];
          return list.length > 0;
        }
        return true;
      });
    }
    return false;
  };

  const hideAvatar = lastMessage && lastMessage.role === "assistant" && hasRenderableContent(lastMessage);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 pt-4 pb-20 space-y-4 no-scrollbar">
      {messages.map((message, index) => {
        const isLast = index === messages.length - 1;
        return (
          <MessageBubble
            key={message.id}
            message={message}
            isStreaming={isLast && isStreaming}
            onOpenDetails={onOpenDetails}
            onSelectCategory={onSelectCategory}
            onSubmitCheckout={onSubmitCheckout}
            activeSpeakingId={activeSpeakingId}
            onSpeak={onSpeak}
            ttsError={ttsError}
          />
        );
      })}
      
      <TypingIndicator show={isThinking} toolName={activeToolName} hideAvatar={!!hideAvatar} />
      
      <div ref={bottomRef} />
    </div>
  );
};
export default MessageList;
