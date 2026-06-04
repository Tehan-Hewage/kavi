export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  variant_id?: string;
  variant_name?: string;
}

export type Language = "en" | "si" | "ta" | "tanglish";

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  url: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  product_count?: number;
}

export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  available: boolean;
  variants?: { id: string; name: string; price: number }[];
}

export interface DeliveryQuote {
  deliverable: boolean;
  delivery_fee: number;
  perishable_warning?: string;
  earliest_date?: string;
  city?: string;
  product_id?: string;
  delivery_date?: string;
}

export interface OrderInput {
  items: {
    product_id: string;
    variant_id?: string;
    quantity: number;
  }[];
  recipient: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  delivery_date: string;
  gift_message?: string;
  sender_name?: string;
}

export interface OrderResult {
  order_id: string;
  pay_url: string;
  total: number;
  expires_at: string;
}

export interface OrderTrackResult {
  order_id: string;
  status: "pending" | "confirmed" | "processing" | "out_for_delivery" | "delivered" | "cancelled";
  recipient: string;
  items: { name: string; quantity: number; price: number }[];
  timeline: { event: string; timestamp: string }[];
  estimated_delivery?: string;
}

export interface AvailabilityResult {
  available: boolean;
  cities?: string[];
}

export type ChatMessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: string;
  toolResults?: {
    tool: string;
    result: any;
    input?: any;
  }[];
  isToolThinking?: boolean;
  toolThinkingName?: string;
}
