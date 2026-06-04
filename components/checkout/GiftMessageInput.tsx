"use client";

import React from "react";
import { Gift } from "lucide-react";

interface GiftMessageInputProps {
  giftMessage: string;
  setGiftMessage: (msg: string) => void;
  senderName: string;
  setSenderName: (name: string) => void;
  recipientName?: string;
}

export const GiftMessageInput: React.FC<GiftMessageInputProps> = ({
  giftMessage,
  setGiftMessage,
  senderName,
  setSenderName,
  recipientName = "Recipient",
}) => {
  const maxLength = 200;

  return (
    <div className="space-y-4 p-4 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 rounded-2xl">
      <div className="flex items-center gap-2 border-b border-purple-100 dark:border-purple-900/30 pb-2">
        <Gift className="w-4 h-4 text-kapruka-purple" />
        <span className="text-xs font-bold text-kapruka-purple dark:text-purple-300 uppercase tracking-wider">
          Gift Card Customization
        </span>
      </div>

      {/* Sender Name */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 dark:text-gray-400">
          Sender Name (Your Name)
        </label>
        <input
          type="text"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="e.g. Priyantha"
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-kapruka-purple"
        />
      </div>

      {/* Gift Message */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400">
            Gift Message
          </label>
          <span className={`text-[10px] font-semibold ${
            giftMessage.length > maxLength - 20 ? "text-amber-600" : "text-gray-400"
          }`}>
            {giftMessage.length}/{maxLength}
          </span>
        </div>
        <textarea
          value={giftMessage}
          onChange={(e) => setGiftMessage(e.target.value.slice(0, maxLength))}
          placeholder="Write a sweet message..."
          rows={3}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-kapruka-purple resize-none"
        />
      </div>

      {/* Gift Card Preview */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Card Preview
        </label>
        <div className="relative p-4 bg-gradient-to-br from-amber-50 to-orange-100/50 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-200/50 dark:border-amber-900/30 rounded-xl shadow-inner min-h-[100px] flex flex-col justify-between">
          <div className="text-[10px] font-bold text-amber-700 dark:text-amber-400 tracking-widest uppercase">
            Kapruka Gift Card
          </div>
          <div className="my-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Dear <span className="font-bold text-gray-800 dark:text-gray-200">{recipientName || "Valued Customer"}</span>,</p>
            <p className="text-xs font-medium italic text-gray-700 dark:text-gray-300 mt-1 break-words">
              "{giftMessage || "Wishing you a wonderful celebration!"}"
            </p>
          </div>
          <div className="text-right text-xs text-gray-500 dark:text-gray-400">
            With love, <span className="font-bold text-gray-800 dark:text-gray-200">{senderName || "Someone Special"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GiftMessageInput;
