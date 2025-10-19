import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  codigoAgente: string;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificación de sesión guardada
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      // En una app real, aquí verificarías el token guardado
      // Por ahora, simulamos que no hay sesión guardada
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simular autenticación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'agente@santateresita.com' && password === '123456') {
        const userData: User = {
          id: '1',
          nombre: 'Juan',
          apellidos: 'Pérez',
          email: email,
          codigoAgente: 'AGT-001',
          isAuthenticated: true,
        };
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
