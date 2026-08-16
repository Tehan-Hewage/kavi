"use client";
import React from "react";
import { motion } from "framer-motion";
import { Home, Building2, MapPin, Plus } from "lucide-react";
import { OutlineButton } from "@/components/ui/buttons/OutlineButton";
import type { SavedAddress } from "@/lib/phase2-types";

function addressIcon(label?: string) {
  const l = typeof label === "string" ? label.toLowerCase() : "";
  if (l.includes("home"))   return <Home size={16} className="text-purple-600 dark:text-purple-300" />;
  if (l.includes("office")) return <Building2 size={16} className="text-purple-600 dark:text-purple-300" />;
  return <MapPin size={16} className="text-purple-600 dark:text-purple-300" />;
}

export function SavedAddressPicker({
  addresses,
  onSelect,
  onUseNew,
}: {
  addresses: SavedAddress[];
  onSelect:  (address: SavedAddress) => void;
  onUseNew:  () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      data-testid="saved-address-picker"
      className="flex flex-col gap-2.5 max-w-md my-2.5 w-full"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
          <MapPin size={14} className="text-purple-600 dark:text-purple-400" />
          Choose a delivery address
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {addresses.map((addr, i) => {
          const labelDisplay = typeof addr.label === "string" ? addr.label : (typeof addr.recipient_name === "string" ? addr.recipient_name : "Saved Address");
          const recipientDisplay = typeof addr.recipient_name === "string" ? addr.recipient_name : "";
          const addressDisplay = typeof addr.address === "string" ? addr.address : "";
          const cityDisplay = typeof addr.city === "string" ? addr.city : "";

          return (
            <motion.button
              key={addr.id ?? i}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(addr)}
              className="group flex items-start gap-3 p-3.5 rounded-2xl text-left transition-all duration-200 bg-white/95 dark:bg-[#1E1136]/95 border border-purple-100 dark:border-purple-800/40 shadow-sm hover:shadow-md hover:border-purple-400 dark:hover:border-purple-500 backdrop-blur-md"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-purple-50 dark:bg-purple-900/50 border border-purple-100 dark:border-purple-800/60"
              >
                {addressIcon(typeof addr.label === "string" ? addr.label : undefined)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {labelDisplay}
                  </p>
                  <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    Deliver here →
                  </span>
                </div>
                {recipientDisplay && (
                  <p className="text-xs font-medium text-gray-600 dark:text-purple-200/90 mt-0.5">
                    {recipientDisplay}
                  </p>
                )}
                {(addressDisplay || cityDisplay) && (
                  <p className="text-xs text-gray-500 dark:text-purple-300/70 truncate mt-0.5">
                    {addressDisplay}{addressDisplay && cityDisplay ? ", " : ""}{cityDisplay}
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <OutlineButton size="sm" onClick={onUseNew}>
        <Plus size={13} />
        <span>Use a different address</span>
      </OutlineButton>
    </motion.div>
  );
}
