// Contextos de autenticación y datos de la aplicación
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Deportista, Championship, Payment, PaymentHistory, AuthContextType, AppContextType, Match } from '../types';
import { mockUsers, mockDeportistas, mockChampionships, mockPayments, mockPaymentHistory } from '../data/mockData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Comentado para que siempre muestre el login primero
  // useEffect(() => {
  //   checkAuthStatus();
  // }, []);

  // const checkAuthStatus = async () => {
  //   try {
  //     const savedUser = await AsyncStorage.getItem('user');
  //     if (savedUser) {
  //       setUser(JSON.parse(savedUser));
  //       setIsAuthenticated(true);
  //     }
  //   } catch (error) {
  //     console.error('Error checking auth status:', error);
  //   }
  // };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const foundUser = mockUsers.find(u => u.username === username && u.password === password);
      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        await AsyncStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deportistas, setDeportistas] = useState<Deportista[]>(mockDeportistas);
  const [championships, setChampionships] = useState<Championship[]>(mockChampionships);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>(mockPaymentHistory);

  const refreshData = async () => {
    // En una implementación real, aquí se harían llamadas a la API
    // Por ahora mantenemos los datos mock
    setDeportistas(mockDeportistas);
    setChampionships(mockChampionships);
    setPayments(mockPayments);
    setPaymentHistory(mockPaymentHistory);
  };

  const addMatchToChampionship = (championshipId: string, match: Match) => {
    setChampionships(prev => prev.map(ch => {
      if (ch.id === championshipId) {
        return { ...ch, matches: [...ch.matches, match] };
      }
      return ch;
    }));
  };

  const updateMatchInChampionship = (championshipId: string, matchId: string, updates: Partial<Match>) => {
    setChampionships(prev => prev.map(ch => {
      if (ch.id === championshipId) {
        const updated = ch.matches.map(m => m.id === matchId ? { ...m, ...updates } as Match : m);
        return { ...ch, matches: updated };
      }
      return ch;
    }));
  };

  const removeMatchFromChampionship = (championshipId: string, matchId: string) => {
    setChampionships(prev => prev.map(ch => {
      if (ch.id === championshipId) {
        const filtered = ch.matches.filter(m => m.id !== matchId);
        return { ...ch, matches: filtered };
      }
      return ch;
    }));
  };

  const updatePaymentStatus = (paymentId: string, nextStatus: Payment['status']) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: nextStatus, paymentDate: nextStatus === 'paid' ? new Date().toISOString().slice(0,10) : p.paymentDate } : p));
    // opcional: historial ligero
    const p = payments.find(px => px.id === paymentId);
    if (p) {
      setPaymentHistory(prev => [
        ...prev,
        {
          id: `hist-${Date.now()}`,
          deportistaId: p.deportistaId,
          description: p.description,
          amount: p.amount,
          status: nextStatus === 'paid' ? 'paid' : nextStatus === 'under_review' ? 'under_review' : 'pending',
          paymentMethod: p.paymentMethod,
          paymentDate: nextStatus === 'paid' ? new Date().toISOString() : undefined,
          receiptImage: p.receiptImage,
          createdAt: new Date().toISOString(),
          type: p.type,
          period: p.period,
          tournamentId: p.tournamentId,
          eventId: p.eventId,
        }
      ]);
    }
  };

  const updatePayment = (paymentId: string, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, ...updates } : p));
  };

  return (
    <AppContext.Provider value={{ 
      deportistas,
      students: deportistas, // Alias para compatibilidad
      championships, 
      payments, 
      paymentHistory, 
      refreshData,
      addMatchToChampionship,
      updateMatchInChampionship,
      removeMatchFromChampionship,
      updatePaymentStatus,
      updatePayment,
    }}>
      {children}
    </AppContext.Provider>
  );
};
