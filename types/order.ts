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
