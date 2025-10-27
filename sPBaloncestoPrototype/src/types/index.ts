// Tipos de datos para la aplicación de la Escuela de Baloncesto San Pedro

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'parent' | 'admin';
  children?: Student[];
}

export interface Student {
  id: string;
  name: string;
  parentId: string;
  category: 'Sub-10' | 'Sub-12' | 'Sub-13' | 'Sub-15';
  gender: 'masculino' | 'femenino';
}

export interface Championship {
  id: string;
  name: string;
  category: string;
  gender: 'masculino' | 'femenino';
  matches: Match[];
  isActive: boolean;
}

export interface Match {
  id: string;
  championshipId: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  category: string;
  gender: 'masculino' | 'femenino';
  status: 'scheduled' | 'completed';
  homeScore?: number;
  awayScore?: number;
}

export interface Payment {
  id: string;
  studentId: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'under_review';
  paymentMethod?: 'card' | 'transfer';
  paymentDate?: string;
  receiptImage?: string;
  createdAt: string;
}

export interface PaymentHistory {
  id: string;
  studentId: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'under_review';
  paymentMethod?: 'card' | 'transfer';
  paymentDate?: string;
  receiptImage?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface AppContextType {
  students: Student[];
  championships: Championship[];
  payments: Payment[];
  paymentHistory: PaymentHistory[];
  refreshData: () => Promise<void>;
}
