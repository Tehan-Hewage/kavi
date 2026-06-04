"use client";

import React from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface CartSummaryProps {
  subtotal: number;
  deliveryFee?: number;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  deliveryFee = 0,
}) => {
  const { t } = useLanguage();

  const formatLKR = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("LKR", "Rs");
  };

  const total = subtotal + deliveryFee;

  return (
    <div className="space-y-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{t.subtotal}</span>
        <span className="font-semibold text-gray-800 dark:text-gray-200">
          {formatLKR(subtotal)}
        </span>
      </div>

      {deliveryFee > 0 && (
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{t.deliveryFee}</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {formatLKR(deliveryFee)}
          </span>
        </div>
      )}

      <div className="flex justify-between text-base font-black text-gray-900 dark:text-white pt-2 border-t border-gray-50 dark:border-gray-800/50">
        <span>{t.total}</span>
        <span>{formatLKR(total)}</span>
      </div>
    </div>
  );
};
export default CartSummary;
