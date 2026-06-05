"use client";

import React, { useState, useEffect, useRef } from "react";
import ChatShell from "@/components/chat/ChatShell";
import MessageList from "@/components/chat/MessageList";
import ProductDetailModal from "@/components/products/ProductDetailModal";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { ChatMessage } from "@/lib/types";
import { useTTS } from "@/hooks/useTTS";
import { useMutePreference } from "@/hooks/useMutePreference";
import { VoiceOrb } from "@/components/ui/VoiceOrb";

const formatFriendlyError = (errorMsg: string): string => {
  const isCreditError = errorMsg.includes("credit balance") || errorMsg.includes("billing") || errorMsg.includes("400");
  const isRateLimit = errorMsg.includes("429") || errorMsg.includes("rate_limit") || errorMsg.includes("too many requests");

  if (isCreditError) {
    return "Aiyyo! It looks like my Anthropic API credit balance is empty. 😔 Please top up your billing credits on Anthropic to continue shopping with Kavi!";
  }
  if (isRateLimit) {
    return "Adoh, it's a bit busy right now! 🚀 Too many requests are coming in. Please wait a minute and try again, machan!";
  }
  return `Sorry, I ran into a bit of trouble: ${errorMsg}. Please try again in a moment!`;
};

export default function ChatPage() {
  const { language } = useLanguage();
  const { cart, cartCount, clearCart } = useCart();
  const { currency } = useCurrency();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // TTS + mute preference
  const { speak, stop: stopSpeaking, isSpeaking } = useTTS();
  const { muted } = useMutePreference();
  const prevIsStreamingRef = useRef(false);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);

  // Reset activeSpeakingId when speaking stops
  useEffect(() => {
    if (!isSpeaking) {
      setActiveSpeakingId(null);
    }
  }, [isSpeaking]);

  const handleSpeak = (text: string, messageId: string) => {
    if (activeSpeakingId === messageId && isSpeaking) {
      stopSpeaking();
    } else {
      setActiveSpeakingId(messageId);
      speak(text, languageRef.current);
    }
  };

  // Refs so sendMessage always reads the LATEST values, never stale closures
  const cartRef = useRef(cart);
  const currencyRef = useRef(currency);
  const languageRef = useRef(language);
  useEffect(() => { cartRef.current = cart; }, [cart]);
  useEffect(() => { currencyRef.current = currency; }, [currency]);
  useEffect(() => { languageRef.current = language; }, [language]);

  // Speak the last assistant message when streaming finishes (and TTS is not muted)
  useEffect(() => {
    const wasStreaming = prevIsStreamingRef.current;
    prevIsStreamingRef.current = isStreaming;

    if (wasStreaming && !isStreaming && !muted) {
      // Find the last assistant message with text content
      const lastAssistant = [...messages].reverse().find(
        (m) => m.role === "assistant" && m.content && m.content.trim().length > 0
      );
      if (lastAssistant?.content) {
        setActiveSpeakingId(lastAssistant.id);
        speak(lastAssistant.content, languageRef.current);
      }
    }
    // If user just muted mid-speech, stop
    if (muted && isSpeaking) {
      stopSpeaking();
    }
  }, [isStreaming, muted]);

  // Initialize and localize welcome message
  useEffect(() => {
    const welcomeMessages = {
      en: "Hello! I am Kavi (කවි), your Kapruka shopping assistant. 🌸 How can I help you today? I can search for gifts, cakes, or track your orders!",
      si: "ආයුබෝවන්! මම කවි, ඔබේ කප්රුක සහායකයා. 🌸 අද මම ඔබට උදව් කරන්නේ කෙසේද? මට තෑගි, කේක් සෙවීමට හෝ ඇණවුම් සොයා දීමට හැකියි!",
      ta: "வணக்கம்! நான் கவி, உங்கள் கப்ருகா ஷாப்பிங் உதவியாளர். 🌸 இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்? நான் பரிசுகள், கேக்குகளை தேடலாம் அல்லது உங்கள் ஆர்டர்களை கண்காணிக்கலாம்!",
      tanglish: "Vanakam machan! I am Kavi, your Kapruka shopping partner. 🌸 Enna help venum? Cakes, flowers or order track pannuvom?"
    };

    const welcomeText = welcomeMessages[language] || welcomeMessages.en;

    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeText,
          timestamp: new Date().toISOString(),
        },
      ]);
    } else if (messages.length === 1 && messages[0].id === "welcome") {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeText,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [language]);

  // Determine active suggestion chips context
  const getChipContext = (): "initial" | "afterSearch" | "afterCart" | "afterOrder" => {
    // Scan messages backwards to find the last meaningful assistant message
    const meaningfulMessages = messages.filter(
      (msg) => msg.role === "assistant" && (msg.content || (msg.toolResults && msg.toolResults.length > 0))
    );

    const hasCreatedOrder = messages.some(msg => 
      msg.toolResults?.some(tr => tr.tool === "kapruka_create_order")
    );
    if (hasCreatedOrder) {
      return "afterOrder";
    }

    if (meaningfulMessages.length > 0) {
      const lastMeaningful = meaningfulMessages[meaningfulMessages.length - 1];

      if (lastMeaningful.toolResults?.some(tr => tr.tool === "kapruka_search_products")) {
        return "afterSearch";
      }

      if (lastMeaningful.content?.includes("[checkout-form]") || lastMeaningful.content?.toLowerCase().includes("checkout")) {
        return "afterCart";
      }
    }

    if (cartCount > 0) {
      return "afterCart";
    }

    return "initial";
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;

    // Append user message
    const userMsgId = String(Date.now());
    const assistantMsgId = String(Date.now() + 1);

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    // Prepare placeholder for assistant
    setMessages(prev => [
      ...prev,
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      },
    ]);

    setIsThinking(true);
    setIsStreaming(true);

    // Convert messages to Anthropic API shape
    const apiMessages = newMessages.map((msg) => {
      let content = msg.content;
      // Provide fallback trace if no content but tool results present
      if (!content && msg.toolResults) {
        content = msg.toolResults.map(tr => `[Showed ${tr.tool} results]`).join("\n");
      }
      return {
        role: msg.role === "user" ? ("user" as const) : ("assistant" as const),
        content: content || "...",
      };
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
          language: languageRef.current,
          cart:     cartRef.current,
          currency: currencyRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to connect to Kavi API.");
      }

      if (!response.body) {
        throw new Error("Response body is empty.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);

              if (data.type === "tool_start") {
                setIsThinking(true);
                setMessages((prev) => {
                  if (prev.length === 0) return prev;
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      ...lastMsg,
                      isToolThinking: true,
                      toolThinkingName: data.tool,
                    };
                    return updated;
                  }
                  return prev;
                });
              } else if (data.type === "tool_result") {
                if (data.tool === "kapruka_clear_cart") {
                  clearCart();
                }
                setMessages((prev) => {
                  if (prev.length === 0) return prev;
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    const existingResults = lastMsg.toolResults || [];
                    const isDuplicate = existingResults.some(
                      (tr) => tr.tool === data.tool && JSON.stringify(tr.result) === JSON.stringify(data.result)
                    );
                    
                    if (!isDuplicate) {
                      const updatedResults = [...existingResults];
                      if (data.tool === "kapruka_create_order" && data.result && typeof data.result === "object" && (data.result.checkout_url || data.result.pay_url)) {
                        clearCart();
                        const itemsSummary = cart.map((item: any) => ({
                          name: item.name,
                          quantity: item.quantity,
                          price: item.price
                        }));
                        updatedResults.push({
                          tool: data.tool,
                          result: {
                            ...data.result,
                            items: itemsSummary,
                            delivery: data.result?.summary?.delivery_fee !== undefined
                              ? data.result.summary.delivery_fee
                              : (data.result?.delivery || 350)
                          },
                          input: data.input
                        });
                      } else {
                        updatedResults.push({
                          tool: data.tool,
                          result: data.result,
                          input: data.input
                        });
                      }
                      
                      const updated = [...prev];
                      updated[updated.length - 1] = {
                        ...lastMsg,
                        isToolThinking: false,
                        toolResults: updatedResults
                      };
                      return updated;
                    }
                  }
                  return prev;
                });
              } else if (data.type === "text") {
                setIsThinking(false);
                setMessages((prev) => {
                  if (prev.length === 0) return prev;
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      ...lastMsg,
                      content: lastMsg.content + data.delta
                    };
                    return updated;
                  }
                  return prev;
                });
              } else if (data.type === "error") {
                setIsThinking(false);
                setMessages((prev) => {
                  if (prev.length === 0) return prev;
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      ...lastMsg,
                      content: formatFriendlyError(data.message),
                      isToolThinking: false
                    };
                    return updated;
                  }
                  return prev;
                });
                break;
              }
            } catch (err) {
              console.error("SSE parse error", err, "raw line:", jsonStr);
              const checkMsg = jsonStr.toLowerCase();
              if (checkMsg.includes("credit balance") || checkMsg.includes("billing") || checkMsg.includes("400") || checkMsg.includes("429") || checkMsg.includes("limit") || checkMsg.includes("error")) {
                setIsThinking(false);
                setMessages((prev) => {
                  if (prev.length === 0) return prev;
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      ...lastMsg,
                      content: formatFriendlyError(jsonStr),
                      isToolThinking: false
                    };
                    return updated;
                  }
                  return prev;
                });
                break;
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => {
        if (prev.length === 0) return prev;
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          const friendlyMessage = formatFriendlyError(err.message || String(err));
          const updatedContent = lastMsg.content === ""
            ? friendlyMessage
            : `${lastMsg.content}\n\n⚠️ **System Alert:** ${friendlyMessage}`;
          
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...lastMsg,
            content: updatedContent,
            isToolThinking: false
          };
          return updated;
        }
        return prev;
      });
    } finally {
      setIsThinking(false);
      setIsStreaming(false);
    }
  };

  const handleOpenDetails = (productId: string) => {
    setActiveProductId(productId);
  };

  const handleSelectCategory = (slug: string, name: string) => {
    sendMessage(`Show products in category ${name}`);
  };

  const handleSubmitCheckout = (details: {
    name: string;
    phone: string;
    address: string;
    city: string;
    deliveryDate: string;
    giftMessage?: string;
    senderName?: string;
  }) => {
    const confirmationMsg = `Confirming order details:
- Recipient Name: ${details.name}
- Phone: ${details.phone}
- Address: ${details.address}
- City: ${details.city}
- Delivery Date: ${details.deliveryDate}${
      details.giftMessage
        ? `\n- Gift Message: ${details.giftMessage}\n- Sender: ${details.senderName}`
        : ""
    }`;
    sendMessage(confirmationMsg);
  };

  return (
    <>
      <ChatShell
        activeChipContext={getChipContext()}
        onSend={sendMessage}
        isThinking={isThinking}
        onProceedToCheckout={() => sendMessage("I am ready to checkout.")}
        voiceOrb={
          <VoiceOrb
            visible={isSpeaking}
            onStop={stopSpeaking}
          />
        }
      >
        <MessageList
          messages={messages}
          isThinking={isThinking}
          isStreaming={isStreaming}
          onOpenDetails={handleOpenDetails}
          onSelectCategory={handleSelectCategory}
          onSubmitCheckout={handleSubmitCheckout}
          activeSpeakingId={activeSpeakingId}
          onSpeak={handleSpeak}
        />
      </ChatShell>

      {/* Slide-Up Detail Modal */}
      <ProductDetailModal
        productId={activeProductId}
        onClose={() => setActiveProductId(null)}
      />
    </>
  );
}
