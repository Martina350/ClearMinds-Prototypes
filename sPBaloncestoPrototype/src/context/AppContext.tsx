// Contextos de autenticación y datos de la aplicación
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Deportista, Championship, Payment, PaymentHistory, AuthContextType, AppContextType, Match, Notification, Reminder } from '../types';
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

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
    setPayments(prev => {
      const updated = prev.map(p => p.id === paymentId ? { ...p, status: nextStatus, paymentDate: nextStatus === 'paid' ? new Date().toISOString().slice(0,10) : p.paymentDate } : p);
      const p = prev.find(px => px.id === paymentId);
      if (p) {
        setPaymentHistory(histPrev => [
          ...histPrev,
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
      return updated;
    });
  };

  const updatePayment = (paymentId: string, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, ...updates } : p));
  };

  const addChampionship = (championship: Championship) => {
    setChampionships(prev => [...prev, championship]);
  };

  const updateChampionship = (championshipId: string, updates: Partial<Championship>) => {
    setChampionships(prev => prev.map(ch => ch.id === championshipId ? { ...ch, ...updates } : ch));
  };

  const removeChampionship = (championshipId: string) => {
    setChampionships(prev => prev.filter(ch => ch.id !== championshipId));
  };

  // Nuevas funcionalidades para notificaciones
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Funcionalidades para recordatorios
  const addReminder = (reminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const removeReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  const toggleReminder = (reminderId: string) => {
    setReminders(prev =>
      prev.map(r => (r.id === reminderId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  // Contadores para badges
  const getPendingPaymentsCount = (userId: string) => {
    const userDeportistas = deportistas.filter(d => d.parentId === userId);
    const deportistaIds = userDeportistas.map(d => d.id);
    return payments.filter(
      p =>
        deportistaIds.includes(p.deportistaId) &&
        (p.status === 'pending' || p.status === 'overdue')
    ).length;
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const getUpcomingMatchesCount = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    let upcomingCount = 0;
    championships.forEach(ch => {
      ch.matches.forEach(match => {
        const matchDate = new Date(match.date);
        if (matchDate >= today && matchDate <= nextWeek && match.status === 'scheduled') {
          upcomingCount++;
        }
      });
    });
    
    return upcomingCount;
  };

  // Efecto para generar notificaciones automáticas
  useEffect(() => {
    const checkPaymentsAndMatches = () => {
      const today = new Date();
      
      // Verificar pagos vencidos
      payments.forEach(payment => {
        const dueDate = new Date(payment.dueDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilDue <= 3 && daysUntilDue >= 0 && payment.status === 'pending') {
          const deportista = deportistas.find(d => d.id === payment.deportistaId);
          const existingNotification = notifications.find(
            n => n.type === 'payment' && n.message.includes(payment.id)
          );
          
          if (!existingNotification && deportista) {
            addNotification({
              type: 'payment',
              title: 'Pago Próximo a Vencer',
              message: `El pago de ${payment.description} para ${deportista.name} vence en ${daysUntilDue} día${daysUntilDue !== 1 ? 's' : ''}`,
            });
          }
        } else if (daysUntilDue < 0 && payment.status === 'pending') {
          const deportista = deportistas.find(d => d.id === payment.deportistaId);
          const existingNotification = notifications.find(
            n => n.type === 'payment' && n.title === 'Pago Vencido' && n.message.includes(payment.id)
          );
          
          if (!existingNotification && deportista) {
            addNotification({
              type: 'payment',
              title: 'Pago Vencido',
              message: `⚠️ El pago de ${payment.description} para ${deportista.name} está vencido`,
            });
          }
        }
      });
      
      // Verificar próximos partidos
      championships.forEach(ch => {
        ch.matches.forEach(match => {
          const matchDate = new Date(match.date);
          const daysUntilMatch = Math.ceil((matchDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilMatch <= 2 && daysUntilMatch >= 0 && match.status === 'scheduled') {
            const existingNotification = notifications.find(
              n => n.type === 'match' && n.message.includes(match.id)
            );
            
            if (!existingNotification) {
              addNotification({
                type: 'match',
                title: 'Próximo Partido',
                message: `${match.homeTeam} vs ${match.awayTeam} - ${daysUntilMatch === 0 ? 'HOY' : `en ${daysUntilMatch} día${daysUntilMatch !== 1 ? 's' : ''}`}`,
              });
            }
          }
        });
      });
    };
    
    // Ejecutar al montar y cada hora
    checkPaymentsAndMatches();
    const interval = setInterval(checkPaymentsAndMatches, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [payments, championships, deportistas]);

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
      addChampionship,
      updateChampionship,
      removeChampionship,
      // Nuevas funcionalidades
      notifications,
      addNotification,
      markNotificationAsRead,
      clearNotifications,
      reminders,
      addReminder,
      removeReminder,
      toggleReminder,
      getPendingPaymentsCount,
      getUnreadNotificationsCount,
      getUpcomingMatchesCount,
    }}>
      {children}
    </AppContext.Provider>
  );
};
