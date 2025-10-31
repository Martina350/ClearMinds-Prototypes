// Tipos de datos para la aplicación de la Escuela de Baloncesto San Pedro

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'parent' | 'admin';
  children?: Student[];
}

export interface Deportista {
  id: string;
  name: string;
  parentId: string;
  category: 'Sub-8' | 'Sub-9' | 'Sub-10' | 'Sub-11' | 'Sub-12' | 'Sub-13' | 'Sub-14' | 'Sub-15' | 'Sub-16' | 'Sub-17';
  gender: 'masculino' | 'femenino';
}

// Alias para compatibilidad
export type Student = Deportista;

export interface Team {
  id: string;
  name: string;
  points: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
}

export interface Championship {
  id: string;
  name: string;
  category: string;
  gender: 'masculino' | 'femenino';
  tournamentType: 'Nacional' | 'Regional';
  matches: Match[];
  isActive: boolean;
  startDate: string;
  currentPhase: string;
  teams?: Team[];
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
  deportistaId: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'under_review';
  paymentMethod?: 'card' | 'transfer';
  paymentDate?: string;
  receiptImage?: string;
  createdAt: string;
  type: 'mensualidad' | 'inscripcion_torneo' | 'inscripcion_evento';
  period?: string; // Para mensualidades: "Enero 2024", "Febrero 2024", etc.
  tournamentId?: string; // Para inscripciones a torneos
  eventId?: string; // Para inscripciones a eventos
}

export interface PaymentHistory {
  id: string;
  deportistaId: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'under_review';
  paymentMethod?: 'card' | 'transfer';
  paymentDate?: string;
  receiptImage?: string;
  createdAt: string;
  type: 'mensualidad' | 'inscripcion_torneo' | 'inscripcion_evento';
  period?: string;
  tournamentId?: string;
  eventId?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface AppContextType {
  deportistas: Deportista[];
  championships: Championship[];
  payments: Payment[];
  paymentHistory: PaymentHistory[];
  refreshData: () => Promise<void>;
  // Alias para compatibilidad
  students: Deportista[];
  addMatchToChampionship: (championshipId: string, match: Match) => void;
  updateMatchInChampionship: (championshipId: string, matchId: string, updates: Partial<Match>) => void;
  removeMatchFromChampionship: (championshipId: string, matchId: string) => void;
  updatePaymentStatus: (paymentId: string, nextStatus: Payment['status']) => void;
  updatePayment: (paymentId: string, updates: Partial<Payment>) => void;
  addChampionship: (championship: Championship) => void;
  updateChampionship: (championshipId: string, updates: Partial<Championship>) => void;
  removeChampionship: (championshipId: string) => void;
}
