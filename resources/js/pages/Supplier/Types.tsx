export interface Category {
  id: number;
  name: string;
  order: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Product {
  id: number;
  supplier_id: number;
  name: string;
  category: Category;
  description: string;
  price: number;
  stock: number;
  images: string;
  sku: string;
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

export type Paginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: any[];
};

export interface Stats {
    total: number;
    low_stock: number;
    out_of_stock: number;
}
