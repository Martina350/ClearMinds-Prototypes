import { Service, Booking } from '../types';

export const formatPrice = (price: number): string => {
  return `$${price}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
};

export const formatTime = (time: string): string => {
  return time;
};

export const getServiceIcon = (imageName: string): string => {
  const icons: {[key: string]: string} = {
    toilet: '🚽',
    septic: '🏠',
    grease: '🛢️',
    trash: '🗑️',
    debris: '🏗️'
  };
  return icons[imageName] || '🔧';
};

export const getStatusColor = (status: string): string => {
  const colors: {[key: string]: string} = {
    'pendiente': '#F39C12',
    'confirmado': '#5CB85C',
    'en_proceso': '#3498DB',
    'completado': '#27AE60',
    'cancelado': '#E74C3C'
  };
  return colors[status] || '#7F8C8D';
};

export const getStatusText = (status: string): string => {
  const texts: {[key: string]: string} = {
    'pendiente': 'PENDIENTE',
    'confirmado': 'CONFIRMADO',
    'en_proceso': 'EN PROCESO',
    'completado': 'COMPLETADO',
    'cancelado': 'CANCELADO'
  };
  return texts[status] || status.toUpperCase();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const generateBookingId = (): string => {
  return `b${Date.now()}`;
};

export const calculateDuration = (baseDuration: number, clientType: 'casa' | 'empresa'): number => {
  return clientType === 'empresa' ? Math.round(baseDuration * 1.5) : baseDuration;
};

export const isDateAvailable = (date: string, bookings: Booking[]): boolean => {
  const today = new Date();
  const selectedDate = new Date(date);
  
  // Check if date is in the future
  if (selectedDate <= today) {
    return false;
  }
  
  // Check if date is within next 30 days
  const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  if (selectedDate > maxDate) {
    return false;
  }
  
  return true;
};

export const getAvailableTimeSlots = (date: string, serviceId: string, bookings: Booking[]): string[] => {
  const allSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  const bookedSlots = bookings
    .filter(booking => 
      booking.serviceId === serviceId && 
      booking.date === date && 
      booking.status !== 'cancelado'
    )
    .map(booking => booking.time);
  
  return allSlots.filter(slot => !bookedSlots.includes(slot));
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
