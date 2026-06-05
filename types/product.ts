export interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  url: string;
  description?: string;
  in_stock?: boolean;
}
