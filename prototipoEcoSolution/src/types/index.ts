export interface User {
  id: number;
  role: 'client' | 'admin';
  country: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  password: string;
  language: string;
}

export interface Service {
  id: string;
  country: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  coverage: string[];
  image: string;
  type: 'casa' | 'empresa';
}

export interface Booking {
  id: string;
  serviceId: string;
  userId: number;
  date: string;
  time: string;
  status: 'pendiente' | 'confirmado' | 'en_proceso' | 'completado' | 'cancelado';
  payment: {
    method: 'card' | 'transfer';
    proof?: string;
    status: 'pending' | 'approved' | 'rejected';
  };
  clientType: 'casa' | 'empresa';
  assignedStaff?: number;
}

export interface Staff {
  id: number;
  name: string;
  phone: string;
  email: string;
  zone: string;
  status: 'available' | 'occupied';
  services: string[];
}

export interface Zone {
  country: string;
  province: string;
  enabled: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

export interface PaymentData {
  method: 'card' | 'transfer';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  cardData?: {
    number: string;
    expiry: string;
    cvc: string;
    holder: string;
  };
  transferData?: {
    accountNumber: string;
    bank: string;
    proof: string;
  };
}

export interface BookingData {
  service: Service;
  clientType: 'casa' | 'empresa';
  date: string;
  time: string;
  duration: number;
}
