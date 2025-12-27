export interface Product {
  id: number;
  supplier_id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  stock: number;
  image_url: string | null;
  generic_name: string | null;
  pack_size: string | null;
  requires_prescription: boolean;
  is_verified: boolean;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}



export interface ProductFormData {
  supplier_id: number;
  name: string;
  category: string;
  description: string;
  price: string;
  stock: number;
  image_url?: string;
  generic_name?: string;
  pack_size?: string;
  requires_prescription: boolean;
  is_verified: boolean;
}
