export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'agent' | 'customer';
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  department: string;
  zipCode: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  active: boolean;
}

export type ShippingZone = 'zone1' | 'zone2';

export interface City {
  _id: string;
  name: string;
  department: string;
  zone: ShippingZone;
  active: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  available: boolean;
  featured: boolean;
  salesCount: number;
  category?: Category;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: User;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: User;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentRef?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}
