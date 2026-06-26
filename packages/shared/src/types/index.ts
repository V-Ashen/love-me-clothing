export type Role = 'admin' | 'staff' | 'customer';

export interface User {
  uid: string;
  email: string;
  role: Role;
}

export interface Product {
  id?: string;
  name: string;
  price: number;
  images: { public_id: string; url: string }[];
}

export interface Order {
  id?: string;
  customerDetails: any;
  items: any[];
  totalAmount: number;
  paymentMethod: 'COD';
  status: 'pending' | 'processing' | 'dispatched' | 'completed';
}
