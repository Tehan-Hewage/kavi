"use client";

import React, { useState, useEffect } from "react";
import ChatShell from "@/components/chat/ChatShell";
import MessageList from "@/components/chat/MessageList";
import ProductDetailModal from "@/components/products/ProductDetailModal";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useCart } from "@/components/providers/CartProvider";
import { ChatMessage } from "@/lib/types";

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
  const { cart, cartCount } = useCart();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

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
    const lastMessage = messages[messages.length - 1];
    
    const hasCreatedOrder = messages.some(msg => 
      msg.toolResults?.some(tr => tr.tool === "kapruka_create_order")
    );
    if (hasCreatedOrder) {
      return "afterOrder";
    }

    if (lastMessage?.toolResults?.some(tr => tr.tool === "kapruka_search_products")) {
      return "afterSearch";
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
          language,
          cart,
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
                  const updated = [...prev];
                  const lastMsg = updated[updated.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    lastMsg.isToolThinking = true;
                    lastMsg.toolThinkingName = data.tool;
                  }
                  return updated;
                });
              } else if (data.type === "tool_result") {
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsg = updated[updated.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    lastMsg.isToolThinking = false;
                    if (!lastMsg.toolResults) lastMsg.toolResults = [];
                    // Avoid duplicate tool results
                    if (!lastMsg.toolResults.some(tr => tr.tool === data.tool && JSON.stringify(tr.result) === JSON.stringify(data.result))) {
                      // Adjust Kapruka create order structure if needed
                      if (data.tool === "kapruka_create_order") {
                        // Include local cart item details for total price summaries
                        const itemsSummary = cart.map(item => ({
                          name: item.name,
                          quantity: item.quantity,
                          price: item.price
                        }));
                        lastMsg.toolResults.push({
                          tool: data.tool,
                          result: {
                            ...data.result,
                            items: itemsSummary,
                            delivery: 350
                          },
                          input: data.input
                        });
                      } else {
                        lastMsg.toolResults.push({ tool: data.tool, result: data.result, input: data.input });
                      }
                    }
                  }
                  return updated;
                });
              } else if (data.type === "text") {
                setIsThinking(false);
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsg = updated[updated.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    lastMsg.content += data.delta;
                  }
                  return updated;
                });
              } else if (data.type === "error") {
                setIsThinking(false);
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsg = updated[updated.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    lastMsg.content = formatFriendlyError(data.message);
                    lastMsg.isToolThinking = false;
                  }
                  return updated;
                });
                break;
              }
            } catch (err) {
              console.error("SSE parse error", err, "raw line:", jsonStr);
              // Fallback error detection if the server sent raw error message or JSON parse failed but line contains error clues
              const checkMsg = jsonStr.toLowerCase();
              if (checkMsg.includes("credit balance") || checkMsg.includes("billing") || checkMsg.includes("400") || checkMsg.includes("429") || checkMsg.includes("limit") || checkMsg.includes("error")) {
                setIsThinking(false);
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastMsg = updated[updated.length - 1];
                  if (lastMsg && lastMsg.role === "assistant") {
                    lastMsg.content = formatFriendlyError(jsonStr);
                    lastMsg.isToolThinking = false;
                  }
                  return updated;
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
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === "assistant") {
          const friendlyMessage = formatFriendlyError(err.message || String(err));
          if (lastMsg.content === "") {
            lastMsg.content = friendlyMessage;
          } else {
            lastMsg.content += `\n\n⚠️ **System Alert:** ${friendlyMessage}`;
          }
          lastMsg.isToolThinking = false;
        }
        return updated;
      });
    } finally {
      setIsThinking(false);
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
      >
        <MessageList
          messages={messages}
          isThinking={isThinking}
          onOpenDetails={handleOpenDetails}
          onSelectCategory={handleSelectCategory}
          onSubmitCheckout={handleSubmitCheckout}
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
