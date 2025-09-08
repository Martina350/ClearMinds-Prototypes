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
  duration: number; // en minutos
  coverage: string[]; // provincias/estados donde está disponible
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
  services: string[]; // IDs de servicios que puede realizar
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

export const db = {
  users: [
    {
      id: 1,
      role: 'client' as const,
      country: 'Ecuador',
      name: 'Juan Pérez',
      email: 'juan@test.com',
      phone: '+593987654321',
      address: 'Av. Amazonas 123',
      city: 'Quito',
      state: 'Pichincha',
      password: '12345',
      language: 'es'
    },
    {
      id: 2,
      role: 'client' as const,
      country: 'USA',
      name: 'John Smith',
      email: 'john@test.com',
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      password: '12345',
      language: 'en'
    },
    {
      id: 3,
      role: 'admin' as const,
      country: 'Ecuador',
      name: 'Admin EcoSolution',
      email: 'admin@ecosolution.com',
      phone: '+593987654321',
      address: 'Oficina Principal',
      city: 'Quito',
      state: 'Pichincha',
      password: 'admin123',
      language: 'es'
    }
  ] as User[],

  services: [
    {
      id: 's1',
      country: 'Ecuador',
      name: 'Baños Portátiles',
      description: 'Servicio de alquiler de baños portátiles para eventos y construcciones. Incluye limpieza y mantenimiento.',
      price: 100,
      duration: 60,
      coverage: ['Pichincha', 'Guayas', 'Azuay'],
      image: 'toilet',
      type: 'casa' as const
    },
    {
      id: 's2',
      country: 'Ecuador',
      name: 'Pozos Sépticos',
      description: 'Instalación, mantenimiento y limpieza de pozos sépticos residenciales y comerciales.',
      price: 150,
      duration: 120,
      coverage: ['Pichincha', 'Guayas', 'Manabí'],
      image: 'septic',
      type: 'casa' as const
    },
    {
      id: 's3',
      country: 'Ecuador',
      name: 'Trampas de Grasa',
      description: 'Instalación y mantenimiento de trampas de grasa para restaurantes y cocinas industriales.',
      price: 200,
      duration: 90,
      coverage: ['Pichincha', 'Guayas'],
      image: 'grease',
      type: 'empresa' as const
    },
    {
      id: 's4',
      country: 'USA',
      name: 'Limpieza de Basureros',
      description: 'Servicio de limpieza y desinfección de contenedores de basura residenciales y comerciales.',
      price: 80,
      duration: 45,
      coverage: ['NY', 'CA', 'TX'],
      image: 'trash',
      type: 'casa' as const
    },
    {
      id: 's5',
      country: 'USA',
      name: 'Recolección de Escombros',
      description: 'Recolección y disposición de escombros de construcción y demolición.',
      price: 120,
      duration: 180,
      coverage: ['NY', 'CA', 'TX'],
      image: 'debris',
      type: 'empresa' as const
    },
    {
      id: 's6',
      country: 'USA',
      name: 'Baños Portátiles',
      description: 'Alquiler de baños portátiles para eventos, construcciones y emergencias.',
      price: 90,
      duration: 60,
      coverage: ['NY', 'CA', 'TX'],
      image: 'toilet',
      type: 'casa' as const
    }
  ] as Service[],

  bookings: [
    {
      id: 'b1',
      serviceId: 's1',
      userId: 1,
      date: '2024-12-20',
      time: '09:00',
      status: 'confirmado' as const,
      payment: {
        method: 'transfer' as const,
        proof: 'comprobante_001.jpg',
        status: 'approved' as const
      },
      clientType: 'casa' as const,
      assignedStaff: 1
    },
    {
      id: 'b2',
      serviceId: 's4',
      userId: 2,
      date: '2024-12-22',
      time: '10:00',
      status: 'pendiente' as const,
      payment: {
        method: 'card' as const,
        status: 'pending' as const
      },
      clientType: 'casa' as const
    },
    {
      id: 'b3',
      serviceId: 's2',
      userId: 1,
      date: '2024-12-18',
      time: '14:00',
      status: 'completado' as const,
      payment: {
        method: 'transfer' as const,
        proof: 'comprobante_002.jpg',
        status: 'approved' as const
      },
      clientType: 'empresa' as const,
      assignedStaff: 2
    }
  ] as Booking[],

  staff: [
    {
      id: 1,
      name: 'Carlos Mendoza',
      phone: '+593987654321',
      email: 'carlos@ecosolution.com',
      zone: 'Pichincha',
      status: 'available' as const,
      services: ['s1', 's2']
    },
    {
      id: 2,
      name: 'Mike Johnson',
      phone: '+1234567890',
      email: 'mike@ecosolution.com',
      zone: 'NY',
      status: 'available' as const,
      services: ['s4', 's5', 's6']
    },
    {
      id: 3,
      name: 'Ana García',
      phone: '+593987654322',
      email: 'ana@ecosolution.com',
      zone: 'Guayas',
      status: 'occupied' as const,
      services: ['s1', 's3']
    },
    {
      id: 4,
      name: 'Roberto Silva',
      phone: '+593987654323',
      email: 'roberto@ecosolution.com',
      zone: 'Azuay',
      status: 'available' as const,
      services: ['s1', 's2']
    },
    {
      id: 5,
      name: 'Sarah Wilson',
      phone: '+1234567891',
      email: 'sarah@ecosolution.com',
      zone: 'CA',
      status: 'available' as const,
      services: ['s4', 's5', 's6']
    }
  ] as Staff[],

  zones: [
    { country: 'Ecuador', province: 'Pichincha', enabled: true },
    { country: 'Ecuador', province: 'Guayas', enabled: true },
    { country: 'Ecuador', province: 'Azuay', enabled: true },
    { country: 'Ecuador', province: 'Manabí', enabled: false },
    { country: 'Ecuador', province: 'Loja', enabled: false },
    { country: 'USA', province: 'NY', enabled: true },
    { country: 'USA', province: 'CA', enabled: true },
    { country: 'USA', province: 'TX', enabled: true }
  ] as Zone[],

  notifications: [
    {
      id: 'n1',
      title: 'Nuevo Servicio Solicitado',
      message: 'Carlos Mendoza solicitó Baños Portátiles',
      type: 'info' as const,
      read: false,
      timestamp: '2024-12-15T19:00:00Z'
    },
    {
      id: 'n2',
      title: 'Pago Pendiente',
      message: 'Transferencia de Juan Pérez requiere validación',
      type: 'warning' as const,
      read: false,
      timestamp: '2024-12-14T19:00:00Z'
    }
  ] as Notification[]
};

// Funciones helper para la base de datos
export const getServicesByCountry = (country: string) => {
  return db.services.filter(service => service.country === country);
};

export const getAvailableTimeSlots = (date: string, serviceId: string) => {
  const service = db.services.find(s => s.id === serviceId);
  if (!service) return [];

  const bookedSlots = db.bookings
    .filter(booking => 
      booking.serviceId === serviceId && 
      booking.date === date && 
      booking.status !== 'cancelado'
    )
    .map(booking => booking.time);

  const allSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  return allSlots.filter(slot => !bookedSlots.includes(slot));
};

export const getUserBookings = (userId: number) => {
  return db.bookings
    .filter(booking => booking.userId === userId)
    .map(booking => ({
      ...booking,
      service: db.services.find(s => s.id === booking.serviceId)
    }));
};

export const getAdminBookings = () => {
  return db.bookings.map(booking => ({
    ...booking,
    service: db.services.find(s => s.id === booking.serviceId),
    user: db.users.find(u => u.id === booking.userId)
  }));
};

export const addBooking = (booking: Omit<Booking, 'id'>) => {
  const newId = `b${Date.now()}`;
  const newBooking = { ...booking, id: newId };
  db.bookings.push(newBooking);
  return newBooking;
};

export const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
  const booking = db.bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = status;
  }
  return booking;
};

// Admin helpers
export const updateBookingPaymentStatus = (bookingId: string, paymentStatus: 'pending' | 'approved' | 'rejected') => {
  const booking = db.bookings.find(b => b.id === bookingId);
  if (!booking) return null;
  booking.payment.status = paymentStatus;
  if (paymentStatus === 'approved') {
    booking.status = 'confirmado';
  } else if (paymentStatus === 'rejected') {
    booking.status = 'pendiente';
  }
  return booking;
};

export const updateServicePrice = (serviceId: string, price: number) => {
  const service = db.services.find(s => s.id === serviceId);
  if (!service) return null;
  service.price = price;
  return service;
};

export const updateStaffStatus = (staffId: number, status: 'available' | 'occupied') => {
  const staff = db.staff.find(s => s.id === staffId);
  if (!staff) return null;
  staff.status = status;
  return staff;
};

export const addStaff = (staff: Omit<Staff, 'id'>) => {
  const newId = Math.max(...db.staff.map(s => s.id)) + 1;
  const newStaff = { ...staff, id: newId } as Staff;
  db.staff.push(newStaff);
  return newStaff;
};

export const assignBookingStaff = (bookingId: string, staffId: number) => {
  const booking = db.bookings.find(b => b.id === bookingId);
  if (!booking) return null;
  booking.assignedStaff = staffId;
  booking.status = 'en_proceso';
  return booking;
};

export const rescheduleBooking = (bookingId: string, date: string, time: string) => {
  const booking = db.bookings.find(b => b.id === bookingId);
  if (!booking) return null;
  booking.date = date;
  booking.time = time;
  booking.status = 'pendiente';
  return booking;
};

export const addZone = (country: string, province: string) => {
  db.zones.push({ country, province, enabled: true });
};

export const setZoneEnabled = (country: string, province: string, enabled: boolean) => {
  const z = db.zones.find(zz => zz.country === country && zz.province === province);
  if (z) z.enabled = enabled;
  return z;
};

export const addUser = (user: Omit<User, 'id'>) => {
  const newId = Math.max(...db.users.map(u => u.id)) + 1;
  const newUser = { ...user, id: newId };
  db.users.push(newUser);
  return newUser;
};

export const authenticateUser = (email: string, password: string) => {
  return db.users.find(user => user.email === email && user.password === password);
};

export const updateUser = (userId: number, updates: Partial<User>) => {
  const index = db.users.findIndex(u => u.id === userId);
  if (index === -1) return null;
  const updated = { ...db.users[index], ...updates } as User;
  db.users[index] = updated;
  return updated;
};