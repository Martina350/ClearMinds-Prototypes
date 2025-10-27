// Datos mock para desarrollo y pruebas
import { User, Student, Championship, Match, Payment, PaymentHistory } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'padre1',
    password: '123456',
    role: 'parent',
    children: [
      {
        id: '1',
        name: 'Juan Pérez',
        parentId: '1',
        category: 'Sub-15',
        gender: 'masculino'
      }
    ]
  },
  {
    id: '2',
    username: 'admin',
    password: 'admin123',
    role: 'admin'
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    parentId: '1',
    category: 'Sub-15',
    gender: 'masculino'
  },
  {
    id: '2',
    name: 'María García',
    parentId: '1',
    category: 'Sub-13',
    gender: 'femenino'
  }
];

export const mockChampionships: Championship[] = [
  {
    id: '1',
    name: 'Nacional Sub-15 Masculino',
    category: 'Sub-15',
    gender: 'masculino',
    isActive: true,
    matches: [
      {
        id: '1',
        championshipId: '1',
        homeTeam: 'San Pedro',
        awayTeam: 'Santa María',
        date: '2024-01-15',
        time: '17:00',
        category: 'Sub-15',
        gender: 'masculino',
        status: 'completed',
        homeScore: 87,
        awayScore: 24
      },
      {
        id: '2',
        championshipId: '1',
        homeTeam: 'San Pedro',
        awayTeam: 'Colegio Central',
        date: '2024-01-20',
        time: '17:00',
        category: 'Sub-15',
        gender: 'masculino',
        status: 'scheduled'
      }
    ]
  },
  {
    id: '2',
    name: 'Nacional Sub-13 Femenino',
    category: 'Sub-13',
    gender: 'femenino',
    isActive: true,
    matches: [
      {
        id: '3',
        championshipId: '2',
        homeTeam: 'San Pedro',
        awayTeam: 'Instituto Norte',
        date: '2024-01-18',
        time: '16:00',
        category: 'Sub-13',
        gender: 'femenino',
        status: 'completed',
        homeScore: 45,
        awayScore: 32
      }
    ]
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    studentId: '1',
    description: 'Mensualidad Enero 2024',
    amount: 30,
    dueDate: '2024-01-05',
    status: 'paid',
    paymentMethod: 'card',
    paymentDate: '2024-01-03',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    studentId: '1',
    description: 'Mensualidad Febrero 2024',
    amount: 30,
    dueDate: '2024-02-05',
    status: 'pending',
    createdAt: '2024-02-01'
  },
  {
    id: '3',
    studentId: '2',
    description: 'Mensualidad Enero 2024',
    amount: 30,
    dueDate: '2024-01-05',
    status: 'under_review',
    paymentMethod: 'transfer',
    receiptImage: 'receipt_maria_jan.jpg',
    createdAt: '2024-01-02'
  }
];

export const mockPaymentHistory: PaymentHistory[] = [
  {
    id: '1',
    studentId: '1',
    description: 'Mensualidad Diciembre 2023',
    amount: 30,
    status: 'paid',
    paymentMethod: 'card',
    paymentDate: '2023-12-28',
    createdAt: '2023-12-01'
  },
  {
    id: '2',
    studentId: '1',
    description: 'Mensualidad Noviembre 2023',
    amount: 30,
    status: 'paid',
    paymentMethod: 'transfer',
    paymentDate: '2023-11-30',
    receiptImage: 'receipt_nov.jpg',
    createdAt: '2023-11-01'
  }
];
