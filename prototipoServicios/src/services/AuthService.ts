export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'tecnico';
  name: string;
  email: string;
}

class AuthService {
  private static instance: AuthService;
  private users: User[] = [
    // Usuarios predefinidos
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      name: 'Administrador Principal',
      email: 'admin@empresa.com'
    },
    {
      id: '2',
      username: 'tecnico1',
      password: 'tecnico123',
      role: 'tecnico',
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com'
    },
    {
      id: '3',
      username: 'tecnico2',
      password: 'tecnico123',
      role: 'tecnico',
      name: 'María García',
      email: 'maria.garcia@empresa.com'
    },
    {
      id: '4',
      username: 'tecnico3',
      password: 'tecnico123',
      role: 'tecnico',
      name: 'Carlos López',
      email: 'carlos.lopez@empresa.com'
    }
  ];

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Autenticar usuario
  authenticate(username: string, password: string): User | null {
    const user = this.users.find(
      u => u.username === username && u.password === password
    );
    return user || null;
  }

  // Obtener todos los usuarios
  getAllUsers(): User[] {
    return this.users;
  }

  // Obtener usuarios por rol
  getUsersByRole(role: 'admin' | 'tecnico'): User[] {
    return this.users.filter(user => user.role === role);
  }

  // Crear nuevo usuario técnico (solo técnicos)
  createTechnician(username: string, password: string, name: string, email: string): User {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      role: 'tecnico',
      name,
      email
    };
    
    this.users.push(newUser);
    return newUser;
  }

  // Verificar si el username ya existe
  isUsernameTaken(username: string): boolean {
    return this.users.some(user => user.username === username);
  }

  // Eliminar usuario
  deleteUser(userId: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== userId);
    return this.users.length < initialLength;
  }

  // Actualizar usuario
  updateUser(userId: string, updates: Partial<User>): User | null {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) return null;

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return this.users[userIndex];
  }
}

export default AuthService;
