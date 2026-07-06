export type Role = 'admin' | 'staff' | 'customer';

export type Permission = 'VIEW_DASHBOARD' | 'MANAGE_ORDERS' | 'MANAGE_PRODUCTS' | 'MANAGE_STAFF' | 'MANAGE_ROLES' | 'VIEW_MESSAGES' | 'VIEW_SETTINGS';

export interface CustomRole {
  id?: string;
  name: string;
  level: number; // 0 = Master Admin, 1 = Admin, 2+ = Staff/Manager
  permissions: Permission[];
}

export interface User {
  uid: string;
  email: string;
  role: Role;
  customRoleId?: string;
  firstName?: string;
  lastName?: string;
}

export interface StoreSettings {
  // Tracking
  facebookPixelId?: string;
  tiktokPixelId?: string;
  // Shipping
  shippingFee: number;
  freeShippingThreshold: number;
  // Contact & Socials
  contactEmail?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
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
  createdAt?: any;
  updatedAt?: any;
}

export interface OrderCartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  size?: string;
  color?: string;
  variant?: { size: string; color: string };
  quantity: number;
}

export interface OrderCustomerDetails {
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  address: string;
}

export interface Order {
  id?: string;
  customerDetails: OrderCustomerDetails;
  items: OrderCartItem[];
  totalAmount: number;
  shippingFee?: number;
  paymentMethod: 'COD';
  status: 'pending' | 'processing' | 'dispatched' | 'completed';
  createdAt?: any;
}

export interface ContactMessage {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt?: any;
  status: 'unread' | 'read';
}
