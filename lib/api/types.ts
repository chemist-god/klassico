// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
}

// Product types
export interface Product {
  id: string;
  name: string;
  price: number;
  balance: number;
  status: string;
  region: string;
  bank: string;
  type: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Cart types
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

// Order types
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

// Wallet types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Ticket types
export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard types
export interface DashboardStats {
  availableFunds: number;
  totalCompleted: number;
  awaitingProcessing: number;
}

export interface BankLog {
  id: string;
  product: string;
  type: string;
  bank: string;
  balance: number;
  price: number;
  region: string;
  status: string;
  description: string;
}

