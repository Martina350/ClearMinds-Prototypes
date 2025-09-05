import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppIcons } from '../components/Icon';

// Auth Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { AdminLoginScreen } from '../screens/auth/AdminLoginScreen';

// Client Screens
import { ServicesScreen } from '../screens/client/ServicesScreen';
import { MyServicesScreen } from '../screens/client/MyServicesScreen';
import { ProfileScreen } from '../screens/client/ProfileScreen';
import { BookingScreen } from '../screens/client/BookingScreen';
import { PaymentScreen } from '../screens/client/PaymentScreen';

// Admin Screens
import { AdminDashboard } from '../screens/admin/AdminDashboard';
import { AdminServices } from '../screens/admin/AdminServices';

// Data
import { authenticateUser, addUser, addBooking, updateBookingStatus } from '../data/database';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Client Tab Navigator
const ClientTabNavigator = ({ user }: { user: any }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          paddingVertical: 8,
          paddingHorizontal: 16,
        },
        tabBarActiveTintColor: '#5CB85C',
        tabBarInactiveTintColor: '#7F8C8D',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'normal',
        },
      }}
    >
      <Tab.Screen
        name="Services"
        options={{
          tabBarLabel: 'Servicios',
          tabBarIcon: ({ color, focused }) => AppIcons.services(20, color),
        }}
      >
        {() => <ServicesScreen user={user} onServicePress={() => {}} onNotificationPress={() => {}} onProfilePress={() => {}} onPhonePress={() => {}} onTabPress={() => {}} />}
      </Tab.Screen>
      <Tab.Screen
        name="MyServices"
        options={{
          tabBarLabel: 'Mis Servicios',
          tabBarIcon: ({ color, focused }) => 
            focused ? AppIcons.myServicesActive(20, color) : AppIcons.myServices(20, color),
        }}
      >
        {() => <MyServicesScreen user={user} onNotificationPress={() => {}} onProfilePress={() => {}} onPhonePress={() => {}} onTabPress={() => {}} />}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, focused }) => 
            focused ? AppIcons.profileActive(20, color) : AppIcons.profile(20, color),
        }}
      >
        {() => <ProfileScreen user={user} onNotificationPress={() => {}} onProfilePress={() => {}} onPhonePress={() => {}} onTabPress={() => {}} onEditProfile={() => {}} onLogout={() => {}} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Main App Navigator
export const AppNavigator = () => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login');

  const handleLogin = (email: string, password: string) => {
    const authenticatedUser = authenticateUser(email, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      setIsAdmin(authenticatedUser.role === 'admin');
      setCurrentScreen(authenticatedUser.role === 'admin' ? 'admin' : 'client');
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const handleRegister = (userData: any) => {
    const newUser = addUser({
      ...userData,
      role: 'client',
      id: 0 // Will be set by addUser function
    });
    setUser(newUser);
    setIsAdmin(false);
    setCurrentScreen('client');
  };

  const handleAdminLogin = (username: string, password: string) => {
    const authenticatedUser = authenticateUser(username, password);
    if (authenticatedUser && authenticatedUser.role === 'admin') {
      setUser(authenticatedUser);
      setIsAdmin(true);
      setCurrentScreen('admin');
    } else {
      alert('Credenciales de administrador incorrectas');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setCurrentScreen('login');
  };

  const handleServicePress = (service: any) => {
    setCurrentScreen('booking');
    // Store service data for booking screen
  };

  const handleBookingContinue = (bookingData: any) => {
    setCurrentScreen('payment');
    // Store booking data for payment screen
  };

  const handlePaymentComplete = (paymentData: any) => {
    if (!user) return;
    
    // Create booking in database
    const booking = addBooking({
      serviceId: paymentData.service.id,
      userId: user.id,
      date: paymentData.date,
      time: paymentData.time,
      status: paymentData.status === 'approved' ? 'confirmado' : 'pendiente',
      payment: {
        method: paymentData.method,
        proof: paymentData.proof,
        status: paymentData.status
      },
      clientType: paymentData.clientType
    });
    
    setCurrentScreen('client');
    alert('Servicio agendado exitosamente');
  };

  const handleTabPress = (tab: string) => {
    if (isAdmin) {
      setCurrentScreen(tab);
    }
  };

  // Render different screens based on current state
  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onRegister={() => setCurrentScreen('register')}
        onAdminAccess={() => setCurrentScreen('adminLogin')}
      />
    );
  }

  if (currentScreen === 'register') {
    return (
      <RegisterScreen
        onRegister={handleRegister}
        onBackToLogin={() => setCurrentScreen('login')}
      />
    );
  }

  if (currentScreen === 'adminLogin') {
    return (
      <AdminLoginScreen
        onLogin={handleAdminLogin}
        onBackToClient={() => setCurrentScreen('login')}
      />
    );
  }

  if (currentScreen === 'booking') {
    return (
      <BookingScreen
        service={{}} // Pass selected service
        user={user}
        onBack={() => setCurrentScreen('client')}
        onContinue={handleBookingContinue}
      />
    );
  }

  if (currentScreen === 'payment') {
    return (
      <PaymentScreen
        bookingData={{}} // Pass booking data
        user={user}
        onBack={() => setCurrentScreen('booking')}
        onComplete={handlePaymentComplete}
      />
    );
  }

  if (isAdmin) {
    switch (currentScreen) {
      case 'admin':
        return <AdminDashboard onTabPress={handleTabPress} onLogout={handleLogout} />;
      case 'services':
        return <AdminServices onTabPress={handleTabPress} onLogout={handleLogout} />;
      default:
        return <AdminDashboard onTabPress={handleTabPress} onLogout={handleLogout} />;
    }
  }

  // Client screens - only render if user is authenticated
  if (user && !isAdmin) {
    return (
      <ClientTabNavigator user={user} />
    );
  }

  // Fallback to login if no user
  return (
    <LoginScreen
      onLogin={handleLogin}
      onRegister={() => setCurrentScreen('register')}
      onAdminAccess={() => setCurrentScreen('adminLogin')}
    />
  );
};
