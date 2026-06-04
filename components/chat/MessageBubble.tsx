"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChatMessage, DeliveryQuote } from "@/lib/types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import ProductCarousel from "../products/ProductCarousel";
import CategoryChips from "../ui/CategoryChips";
import PayLinkCard from "../checkout/PayLinkCard";
import StatusTimeline from "../ui/StatusTimeline";
import CheckoutForm from "../checkout/CheckoutForm";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
  onOpenDetails?: (productId: string) => void;
  onSelectCategory?: (slug: string, name: string) => void;
  onSubmitCheckout?: (details: any) => void;
}

const customBubbleVariants = {
  hidden:  { opacity: 0, y: 14, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
  },
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
  onOpenDetails,
  onSelectCategory,
  onSubmitCheckout,
}) => {
  const { language } = useLanguage();
  const isUser = message.role === "user";
  const isSinhala = language === "si";
  const isTamil = language === "ta";

  const fontClass = isSinhala ? "font-sinhala" : isTamil ? "font-tamil" : "";

  const parseMarkdown = (rawText: string) => {
    if (!rawText) return null;

    const lines = rawText.split("\n");
    const parsedElements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];

    const parseInline = (inlineText: string): React.ReactNode[] => {
      const parts = inlineText.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
      return parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index} className="font-extrabold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("[") && part.includes("](")) {
          const closeBracketIdx = part.indexOf("](");
          const linkText = part.slice(1, closeBracketIdx);
          const linkUrl = part.slice(closeBracketIdx + 2, -1);
          return (
            <a
              key={index}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline text-brand-purple dark:text-brand-purple-mid hover:opacity-85 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              {parseInline(linkText)}
            </a>
          );
        }
        return part;
      });
    };

    lines.forEach((line, lineIdx) => {
      const trimmedLine = line.trim();
      const isBullet = trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ");

      if (isBullet) {
        const bulletText = trimmedLine.slice(2);
        currentList.push(
          <li key={lineIdx} className="list-disc ml-5 mb-1 text-sm md:text-base leading-relaxed">
            {parseInline(bulletText)}
          </li>
        );
      } else {
        if (currentList.length > 0) {
          parsedElements.push(
            <ul key={`list-${lineIdx}`} className="space-y-1 my-2">
              {currentList}
            </ul>
          );
          currentList = [];
        }

        if (trimmedLine === "") {
          parsedElements.push(<div key={`br-${lineIdx}`} className="h-2" />);
        } else {
          parsedElements.push(
            <p key={`p-${lineIdx}`} className="text-sm md:text-base leading-relaxed mb-1.5 whitespace-pre-wrap">
              {parseInline(line)}
            </p>
          );
        }
      }
    });

    if (currentList.length > 0) {
      parsedElements.push(
        <ul key="list-final" className="space-y-1 my-2">
          {currentList}
        </ul>
      );
    }

    return <div className="space-y-0.5">{parsedElements}</div>;
  };

  // Parse text message and replace `[checkout-form]` with the form component
  const renderMessageContent = (text: string) => {
    if (!text) return null;

    if (text.includes("[checkout-form]")) {
      const parts = text.split("[checkout-form]");
      return (
        <div className="space-y-3 w-full">
          {parts[0] && <div className="leading-relaxed">{parseMarkdown(parts[0])}</div>}
          {onSubmitCheckout && (
            <CheckoutForm onSubmit={onSubmitCheckout} />
          )}
          {parts[1] && <div className="leading-relaxed">{parseMarkdown(parts[1])}</div>}
        </div>
      );
    }

    return parseMarkdown(text);
  };

  const renderToolResult = (tool: string, result: any, input: any) => {
    if (!result) return null;

    switch (tool) {
      case "kapruka_search_products":
        const productList = result?.results || (Array.isArray(result) ? result : null);
        if (!productList) {
          return (
            <div key={tool} className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic font-semibold px-2">
              {typeof result === "string" ? result : JSON.stringify(result)}
            </div>
          );
        }
        return (
          <div key={tool} className="w-full mt-2">
            <ProductCarousel products={productList} onOpenDetails={onOpenDetails} />
          </div>
        );
      case "kapruka_list_categories":
      case "kapruka_get_categories":
        const categoryList = (result.categories || result || []).map((cat: any) => ({
          id: cat.name,
          name: cat.name,
          slug: cat.name
        }));
        return (
          <div key={tool} className="w-full mt-2">
            <CategoryChips categories={categoryList} onSelectCategory={onSelectCategory} />
          </div>
        );
      case "kapruka_check_delivery":
      case "kapruka_quote_delivery":
        const deliverable = result.available !== undefined ? result.available : result.deliverable;
        const deliveryFee = result.rate !== undefined ? result.rate : (result.delivery_fee || 0);
        return (
          <div key={tool} className="bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-4 my-2 text-xs font-semibold max-w-sm">
            <h5 className="text-[10px] font-extrabold text-kapruka-purple dark:text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Delivery Check Result
            </h5>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">City:</span>
                <span className="text-gray-800 dark:text-gray-200 font-bold">{input?.city || "Selected City"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deliverable:</span>
                <span className={deliverable ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                  {deliverable ? "Yes" : "No"}
                </span>
              </div>
              {deliverable && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee:</span>
                  <span className="text-gray-900 dark:text-white font-extrabold">Rs {deliveryFee.toLocaleString()}</span>
                </div>
              )}
              {result.perishable_warning && (
                <div className="flex items-start gap-1 text-[10px] text-amber-600 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-950/10 p-2 rounded-lg border border-amber-100 dark:border-amber-900/20 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{result.perishable_warning}</span>
                </div>
              )}
            </div>
          </div>
        );
      case "kapruka_create_order":
        const checkoutUrl = result.checkout_url || result.pay_url;
        const orderRef = result.order_ref || result.order_id;
        const grandTotal = result.summary?.grand_total || result.total || 0;
        const deliveryCost = result.summary?.delivery_fee || result.delivery || 0;
        return (
          <div key={tool} className="w-full mt-2">
            <PayLinkCard
              orderId={orderRef}
              payUrl={checkoutUrl}
              expiresAt={result.expires_at}
              items={result.items || []}
              total={grandTotal}
              delivery={deliveryCost}
            />
          </div>
        );
      case "kapruka_track_order":
        let mappedStatus: any = "processing";
        const serverStatus = String(result.status || "").toLowerCase();
        if (serverStatus.includes("pending") || serverStatus.includes("received")) mappedStatus = "pending";
        else if (serverStatus.includes("confirm")) mappedStatus = "confirmed";
        else if (serverStatus.includes("ship") || serverStatus.includes("transit") || serverStatus.includes("out")) mappedStatus = "out_for_delivery";
        else if (serverStatus.includes("deliver")) mappedStatus = "delivered";
        else if (serverStatus.includes("cancel")) mappedStatus = "cancelled";

        const mappedTimeline = (result.progress || result.timeline || []).map((step: any) => ({
          event: step.step || step.event || "Status updated",
          timestamp: step.timestamp
        }));

        const recipientName = result.recipient?.name || result.recipient || "";
        const estDelivery = result.delivery_date || result.estimated_delivery;

        return (
          <div key={tool} className="w-full mt-2">
            <StatusTimeline
              status={mappedStatus}
              timeline={mappedTimeline}
              estimatedDelivery={estDelivery}
              recipient={recipientName}
            />
          </div>
        );
      case "kapruka_check_availability":
        return (
          <div key={tool} className="bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-700 p-3 rounded-xl text-xs my-2 max-w-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              Availability: {result.available ? "✅ Available for delivery!" : "❌ Not available."}
            </p>
            {result.cities && result.cities.length > 0 && (
              <p className="text-gray-500 mt-1">Available cities: {result.cities.join(", ")}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={customBubbleVariants}
      initial="hidden"
      animate="visible"
      className={`flex items-end gap-3 mb-4 w-full ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar for Kavi */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mb-1 shadow-sm"
          style={{ background: "var(--brand-purple)" }}
        >
          K
        </div>
      )}

      {/* Bubble Container */}
      <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"} max-w-[85%] md:max-w-[70%]`}>
        
        {/* Main Text Content */}
        {message.content && (
          <div
            className={`px-4 py-3 ${fontClass}`}
            style={{
              background:   isUser ? "var(--brand-purple)" : "var(--agent-bubble)",
              color:        isUser ? "#FFFFFF" : "var(--text-primary)",
              borderRadius: isUser
                ? "20px 20px 4px 20px"
                : "4px 20px 20px 20px",
              boxShadow:    "var(--shadow-card)",
              fontSize:     "15px",
              lineHeight:   "1.65",
              maxWidth:     "100%",
            }}
          >
            {renderMessageContent(message.content)}
            {/* Streaming Cursor */}
            {isStreaming && <span className="cursor-blink" />}
          </div>
        )}

        {/* Embedded Tool Results */}
        {message.toolResults && (() => {
          const hasSuccessfulSearch = message.toolResults.some(tr => {
            if (tr.tool !== "kapruka_search_products") return false;
            const list = tr.result?.results || (Array.isArray(tr.result) ? tr.result : null);
            return list && list.length > 0;
          });
          
          return message.toolResults
            .filter(tr => {
              if (tr.tool === "kapruka_search_products") {
                const list = tr.result?.results || (Array.isArray(tr.result) ? tr.result : null);
                const isSuccess = list && list.length > 0;
                
                if (hasSuccessfulSearch) {
                  return isSuccess;
                }
              }
              return true;
            })
            .map((tr, idx) =>
              renderToolResult(tr.tool, tr.result, tr.input)
            );
        })()}
      </div>
    </motion.div>
  );
};
export default MessageBubble;
