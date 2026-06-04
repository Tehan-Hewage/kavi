"use client";

import React, { useState } from "react";
import DeliveryDatePicker from "./DeliveryDatePicker";
import GiftMessageInput from "./GiftMessageInput";
import { User, Phone, MapPin, Building2, Gift, Send, Info } from "lucide-react";

interface CheckoutFormProps {
  onSubmit: (details: {
    name: string;
    phone: string;
    address: string;
    city: string;
    deliveryDate: string;
    giftMessage?: string;
    senderName?: string;
  }) => void;
  isPerishable?: boolean;
}

const CITIES = [
  "Colombo",
  "Kandy",
  "Galle",
  "Negombo",
  "Jaffna",
  "Gampaha",
  "Kurunegala",
  "Kalutara",
  "Matara",
  "Batticaloa",
  "Trincomalee",
  "Ratnapura"
];

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSubmit,
  isPerishable = false,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Colombo");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isGift, setIsGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validatePhone = (num: string) => {
    // Standard Sri Lanka phone: +947XXXXXXXX, 07XXXXXXXX, etc.
    const cleanNum = num.replace(/\s+/g, "");
    const slRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    return slRegex.test(cleanNum);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter the recipient's name.");
      return;
    }
    if (!validatePhone(phone)) {
      setError("Please enter a valid Sri Lankan phone number (e.g. 0771234567).");
      return;
    }
    if (!address.trim()) {
      setError("Please enter the delivery address.");
      return;
    }
    if (!city) {
      setError("Please select a city.");
      return;
    }
    if (!deliveryDate) {
      setError("Please select a delivery date.");
      return;
    }

    onSubmit({
      name,
      phone,
      address,
      city,
      deliveryDate,
      giftMessage: isGift ? giftMessage : undefined,
      senderName: isGift ? senderName : undefined,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-2xl p-5 shadow-lg max-w-md w-full my-3">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3 mb-4">
        <Building2 className="w-5 h-5 text-kapruka-purple" />
        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
          Delivery Details
        </h4>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-kapruka-purple" />
            Recipient Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ruwan Perera"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-kapruka-purple"
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-kapruka-purple" />
            Recipient Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 077 123 4567"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-kapruka-purple"
          />
        </div>

        {/* City Dropdown */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-kapruka-purple" />
            Delivery City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-kapruka-purple"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Delivery Address */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-kapruka-purple" />
            Delivery Address
          </label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street address, apartment, ward, etc."
            rows={2}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:border-kapruka-purple resize-none"
          />
        </div>

        {/* Date Picker */}
        <DeliveryDatePicker
          value={deliveryDate}
          onChange={setDeliveryDate}
          isPerishable={isPerishable}
        />

        {/* Gift Option Toggle */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-kapruka-purple" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Is this a gift order?
            </span>
          </div>
          <input
            type="checkbox"
            checked={isGift}
            onChange={(e) => setIsGift(e.target.checked)}
            className="w-4 h-4 rounded text-kapruka-purple focus:ring-kapruka-purple"
          />
        </div>

        {/* Gift Message Card */}
        {isGift && (
          <GiftMessageInput
            giftMessage={giftMessage}
            setGiftMessage={setGiftMessage}
            senderName={senderName}
            setSenderName={setSenderName}
            recipientName={name}
          />
        )}

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl border border-rose-100 dark:border-rose-900/30">
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-kapruka-purple hover:bg-kapruka-purple-dark text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Confirm & Review Details</span>
        </button>
      </form>
    </div>
  );
};
export default CheckoutForm;
