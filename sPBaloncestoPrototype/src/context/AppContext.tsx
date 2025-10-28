// Contextos de autenticación y datos de la aplicación
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Student, Championship, Payment, PaymentHistory, AuthContextType, AppContextType } from '../types';
import { mockUsers, mockStudents, mockChampionships, mockPayments, mockPaymentHistory } from '../data/mockData';

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
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [championships, setChampionships] = useState<Championship[]>(mockChampionships);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>(mockPaymentHistory);

  const refreshData = async () => {
    // En una implementación real, aquí se harían llamadas a la API
    // Por ahora mantenemos los datos mock
    setStudents(mockStudents);
    setChampionships(mockChampionships);
    setPayments(mockPayments);
    setPaymentHistory(mockPaymentHistory);
  };

  return (
    <AppContext.Provider value={{ 
      students, 
      championships, 
      payments, 
      paymentHistory, 
      refreshData 
    }}>
      {children}
    </AppContext.Provider>
  );
};
