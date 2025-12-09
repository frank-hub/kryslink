export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  supplier: string;
  image: string;
  description: string;
  stock: number;
  rating: number;
  verified: boolean; // PPB Verified
}

export interface CartItem extends Product {
  quantity: number;
}

export interface NewUser {
  id: string;
  name: string;
  business_name: string;
  email: string;
  password: string;
  password_confirmation : string;
  county: string;
  role: 'CUSTOMER' | 'SUPPLIER' | 'ADMIN';
  isVerified: boolean;
  kra_pin: string;
  pharmacyLicense?: string;
  user_type?: 'PHARMACY' | 'HOSPITAL';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Page {
  WELCOME = 'WELCOME',
  MARKETPLACE = 'MARKETPLACE',
  PRODUCT_SHOW = 'PRODUCT_SHOW',
  PROFILE = 'PROFILE'
}
