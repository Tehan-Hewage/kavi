"use client";
import React from "react";
import { motion } from "framer-motion";
import { YellowButton } from "@/components/ui/buttons/YellowButton";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import { Package, MapPin, Calendar, RotateCcw, Clock, CheckCircle2, Truck, AlertCircle } from "lucide-react";
import type { OrderHistoryItem } from "@/lib/phase2-types";

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string; icon: any }> = {
  delivered: {
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    label: "Delivered",
    icon: CheckCircle2,
  },
  out_for_delivery: {
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500 animate-pulse",
    label: "Out for Delivery",
    icon: Truck,
  },
  processing: {
    bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40",
    text: "text-purple-700 dark:text-purple-300",
    dot: "bg-purple-500 animate-pulse",
    label: "Processing",
    icon: Clock,
  },
  in_process: {
    bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40",
    text: "text-purple-700 dark:text-purple-300",
    dot: "bg-purple-500 animate-pulse",
    label: "In Process",
    icon: Clock,
  },
  "in process": {
    bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/40",
    text: "text-purple-700 dark:text-purple-300",
    dot: "bg-purple-500 animate-pulse",
    label: "In Process",
    icon: Clock,
  },
  cancelled: {
    bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/40",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    label: "Cancelled",
    icon: AlertCircle,
  },
};

export function OrderHistoryCard({
  order,
  index = 0,
  onReorder,
  onTrack,
}: {
  order: OrderHistoryItem;
  index?: number;
  onReorder: (ref: string) => void;
  onTrack:   (ref: string) => void;
}) {
  const orderRef = String(
    (order as any).order_reference ||
    (order as any).order_ref ||
    (order as any).order_id ||
    (order as any).order_number ||
    (order as any).orderNumber ||
    (order as any).reference ||
    (order as any).order_no ||
    (order as any).orderNo ||
    (order as any).id ||
    ""
  ).trim();

  const statusStr = typeof order.status === "string" && order.status
    ? order.status
    : "Processing";
  const statusKey = statusStr.toLowerCase();
  const statusConfig = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.processing;
  const StatusIcon = statusConfig.icon;

  const recipientDisplay = (() => {
    if (!order.recipient) return "";
    if (typeof order.recipient === "string") return order.recipient;
    if (typeof order.recipient === "object") {
      const r = order.recipient as any;
      const parts = [r.name || r.recipient_name, r.city || r.address].filter(Boolean);
      return parts.length > 0 ? parts.join(", ") : "";
    }
    return String(order.recipient);
  })();

  const itemsSummaryDisplay = (() => {
    const rawSummary = (order as any).items_summary || (order as any).item_summary;
    let summaryText = "";
    if (rawSummary) {
      if (typeof rawSummary === "string") summaryText = rawSummary;
      else if (Array.isArray(rawSummary)) {
        summaryText = rawSummary
          .map((i: any) => (typeof i === "string" ? i : i.name || i.title || ""))
          .filter(Boolean)
          .join(", ");
      } else if (typeof rawSummary === "object") {
        summaryText = rawSummary.name || rawSummary.title || rawSummary.summary || "";
      }
    } else {
      const rawItems = (order as any).items || (order as any).products;
      if (Array.isArray(rawItems)) {
        summaryText = rawItems
          .map((i: any) => (typeof i === "string" ? i : i.name || i.title || ""))
          .filter(Boolean)
          .join(", ");
      }
    }
    return summaryText
      .replace(/\s*MessageID\s*\w*\.jpg/gi, "")
      .replace(/\s*\w+\.(jpg|png|jpeg|webp)/gi, "")
      .trim();
  })();

  const amountDisplay = (() => {
    const directAmount =
      (order as any).amount ??
      (order as any).total ??
      (order as any).grand_total ??
      (order as any).order_total ??
      (order as any).price;

    if (directAmount !== undefined && directAmount !== null && directAmount !== 0 && directAmount !== "0") {
      if (typeof directAmount === "number") return directAmount.toLocaleString("en-LK");
      if (typeof directAmount === "string") {
        const parsed = parseFloat(directAmount.replace(/[^0-9.-]+/g, ""));
        return isNaN(parsed) ? directAmount : parsed.toLocaleString("en-LK");
      }
    }

    const rawItems = (order as any).items || (order as any).products;
    if (Array.isArray(rawItems) && rawItems.length > 0) {
      const itemsSum = rawItems.reduce((sum: number, item: any) => {
        const p = typeof item === "object" ? (item.price ?? item.amount ?? item.total ?? 0) : 0;
        const q = typeof item === "object" ? (item.quantity ?? item.qty ?? 1) : 1;
        return sum + Number(p) * Number(q);
      }, 0);
      if (itemsSum > 0) {
        return itemsSum.toLocaleString("en-LK");
      }
    }

    return null;
  })();

  const formattedDate = (() => {
    const rawDate =
      (order as any).order_date ||
      (order as any).delivery_date ||
      (order as any).date ||
      (order as any).created_at ||
      (order as any).placed_at ||
      (order as any).orderDate ||
      (order as any).timestamp;

    if (!rawDate) return "Recent";
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return String(rawDate);
      return d.toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return String(rawDate);
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      data-testid="order-history-card"
      className="group relative flex flex-col gap-3 p-4 rounded-2xl my-2.5 max-w-md w-full transition-all duration-200 bg-white/95 dark:bg-[#1E1136]/95 border border-purple-100/80 dark:border-purple-800/40 shadow-[0_4px_20px_rgba(76,29,110,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md hover:border-purple-300 dark:hover:border-purple-600/60"
    >
      {/* Top Bar: Order Reference & Status Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-800/50 px-2.5 py-1 rounded-xl">
          <Package size={13} className="text-purple-600 dark:text-purple-300 flex-shrink-0" />
          <span className="text-xs font-mono font-bold text-purple-900 dark:text-purple-200 tracking-tight">
            {orderRef ? `#${orderRef}` : "Order"}
          </span>
        </div>

        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${statusConfig.bg} ${statusConfig.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          <span className="uppercase tracking-wide text-[10px]">{statusConfig.label}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-1.5">
        {itemsSummaryDisplay && (
          <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
            {itemsSummaryDisplay}
          </h4>
        )}

        {recipientDisplay && (
          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-purple-200/80">
            <MapPin size={13} className="text-purple-500 dark:text-purple-400 flex-shrink-0" />
            <span className="font-medium">To: {recipientDisplay}</span>
          </div>
        )}
      </div>

      {/* Date & Price Row */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-purple-900/30 text-xs">
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-purple-300/70">
          <Calendar size={13} className="flex-shrink-0" />
          <span>{formattedDate}</span>
        </div>

        {amountDisplay && (
          <div className="font-extrabold text-sm text-purple-900 dark:text-purple-200">
            Rs {amountDisplay}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <YellowButton
          size="sm"
          icon={<RotateCcw size={13} className="stroke-[2.5]" />}
          onClick={() => onReorder(orderRef)}
        >
          Order again
        </YellowButton>

        {orderRef && (
          <OutlineButton size="sm" onClick={() => onTrack(orderRef)}>
            <MapPin size={13} className="text-purple-600 dark:text-purple-300" />
            <span>Track</span>
          </OutlineButton>
        )}
      </div>
    </motion.div>
  );
}
