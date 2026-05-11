export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  imageUrl?: string;
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  ready: boolean;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  timestamp: any;
  type: 'dineIn';
  total: number;
}

export interface DeliveryOrder {
  id: string;
  name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  status: OrderStatus;
  timestamp: any;
  total: number;
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guestCount: number;
  specialRequests: string;
  status: 'pending' | 'confirmed' | 'rejected';
  timestamp: any;
}

export interface UserProfile {
  uid: string;
  role: 'admin';
  email: string;
}
