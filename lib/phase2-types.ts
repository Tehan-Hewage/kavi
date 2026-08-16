export interface CustomerDetails {
  name:      string;
  email:     string;
  phone?:    string;
  language?: "en" | "si" | "ta";
  billing?: {
    address?: string;
    city?:    string;
  };
}

export interface OrderHistoryItem {
  order_reference: string;
  status:          string;
  order_date?:     string;    // ISO
  delivery_date?:  string;    // ISO
  amount?:         number;    // LKR
  recipient?:      string | { name?: string; phone?: string; address?: string; city?: string };
  items_summary?:  string;    // e.g. "Birthday Cake, Red Roses Bouquet"
  items?:          any[];
}

export interface OrderHistoryResponse {
  email:  string;
  orders: OrderHistoryItem[];
}

export interface SavedAddress {
  id?:            string;
  label?:         string;     // "Home", "Office", etc. — may be absent
  recipient_name: string;
  address:        string;
  city:           string;
  phone:          string;
  last_used?:     string;     // ISO — for "recently used" addresses
}

export interface CustomerAddressesResponse {
  email:     string;
  addresses: SavedAddress[];
}
