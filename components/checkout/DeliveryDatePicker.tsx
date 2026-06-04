"use client";

import React from "react";
import { format, addDays, isPast, parseISO } from "date-fns";
import { Calendar } from "lucide-react";

interface DeliveryDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  isPerishable?: boolean;
}

export const DeliveryDatePicker: React.FC<DeliveryDatePickerProps> = ({
  value,
  onChange,
  isPerishable = false,
}) => {
  // Get today's date in Sri Lanka (GMT+5:30)
  const today = new Date();
  
  // Perishables like cakes / flowers usually require next-day delivery if ordered late
  const minDate = isPerishable 
    ? format(addDays(today, 1), "yyyy-MM-dd")
    : format(today, "yyyy-MM-dd");

  const maxDate = format(addDays(today, 60), "yyyy-MM-dd"); // Limit to 60 days out

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
        <Calendar className="w-3.5 h-3.5 text-kapruka-purple" />
        Delivery Date
      </label>
      <div className="relative">
        <input
          type="date"
          min={minDate}
          max={maxDate}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-kapruka-purple focus:ring-1 focus:ring-kapruka-purple transition-all duration-200"
        />
      </div>
      {isPerishable && (
        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
          * Perishable items (Cakes/Flowers) require a minimum 24-hour advance order. Same-day delivery is restricted.
        </p>
      )}
    </div>
  );
};
export default DeliveryDatePicker;
