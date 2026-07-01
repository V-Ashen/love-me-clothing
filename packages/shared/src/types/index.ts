export type Role = 'admin' | 'staff' | 'customer';

export interface User {
  uid: string;
  email: string;
  role: Role;
}

export interface ProductVariant {
  color: string;
  size: string;
  stock: number;
  price?: number;
}

export interface ProductColorImage {
  color: string;
  images: { publicId: string; url: string }[];
}

export interface Product {
  id?: string;
  name: string;
  price: number;
  discountPercentage?: number;
  description?: string;
  category?: 'Top' | 'Bottom' | 'Outerwear';
  subCategory?: string;
  stock?: number; // Kept for backward compatibility or simple products
  colors?: string[];
  sizes?: string[];
  variants?: ProductVariant[];
  colorImages?: ProductColorImage[];
  featured?: boolean;
  status?: 'ACTIVE' | 'DRAFT';
  images: { publicId: string; url: string }[]; // Default images or legacy images
  tags?: string[];
}

export interface Order {
  id?: string;
  customerDetails: any;
  items: any[];
  totalAmount: number;
  paymentMethod: 'COD';
  status: 'pending' | 'processing' | 'dispatched' | 'completed';
}
