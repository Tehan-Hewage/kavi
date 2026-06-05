export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  variant_id?: string;
  variant_name?: string;
}
