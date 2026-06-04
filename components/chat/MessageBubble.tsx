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

  // Parse text message and replace `[checkout-form]` with the form component
  const renderMessageContent = (text: string) => {
    if (!text) return null;

    if (text.includes("[checkout-form]")) {
      const parts = text.split("[checkout-form]");
      return (
        <div className="space-y-3 w-full">
          {parts[0] && <p className="leading-relaxed whitespace-pre-wrap">{parts[0]}</p>}
          {onSubmitCheckout && (
            <CheckoutForm onSubmit={onSubmitCheckout} />
          )}
          {parts[1] && <p className="leading-relaxed whitespace-pre-wrap">{parts[1]}</p>}
        </div>
      );
    }

    return <p className="leading-relaxed whitespace-pre-wrap">{text}</p>;
  };

  const renderToolResult = (tool: string, result: any, input: any) => {
    if (!result) return null;

    switch (tool) {
      case "kapruka_search_products":
        return (
          <div key={tool} className="w-full mt-2">
            <ProductCarousel products={result} />
          </div>
        );
      case "kapruka_get_categories":
        return (
          <div key={tool} className="w-full mt-2">
            <CategoryChips categories={result} onSelectCategory={onSelectCategory} />
          </div>
        );
      case "kapruka_quote_delivery":
        const quote = result as DeliveryQuote;
        return (
          <div key={tool} className="bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-4 my-2 text-xs font-semibold max-w-sm">
            <h5 className="text-[10px] font-extrabold text-kapruka-purple dark:text-purple-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Delivery Quote Result
            </h5>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">City:</span>
                <span className="text-gray-800 dark:text-gray-200 font-bold">{input?.city || "Selected City"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deliverable:</span>
                <span className={quote.deliverable ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                  {quote.deliverable ? "Yes" : "No"}
                </span>
              </div>
              {quote.deliverable && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee:</span>
                  <span className="text-gray-900 dark:text-white font-extrabold">Rs {quote.delivery_fee.toLocaleString()}</span>
                </div>
              )}
              {quote.perishable_warning && (
                <div className="flex items-start gap-1 text-[10px] text-amber-600 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-950/10 p-2 rounded-lg border border-amber-100 dark:border-amber-900/20 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{quote.perishable_warning}</span>
                </div>
              )}
            </div>
          </div>
        );
      case "kapruka_create_order":
        // Map elements for PayLinkCard
        return (
          <div key={tool} className="w-full mt-2">
            <PayLinkCard
              orderId={result.order_id}
              payUrl={result.pay_url}
              expiresAt={result.expires_at}
              items={result.items || []}
              total={result.total}
              delivery={result.delivery || 0}
            />
          </div>
        );
      case "kapruka_track_order":
        return (
          <div key={tool} className="w-full mt-2">
            <StatusTimeline
              status={result.status}
              timeline={result.timeline}
              estimatedDelivery={result.estimated_delivery}
              recipient={result.recipient}
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
        {message.toolResults && message.toolResults.map((tr) =>
          renderToolResult(tr.tool, tr.result, tr.input)
        )}
      </div>
    </motion.div>
  );
};
export default MessageBubble;
