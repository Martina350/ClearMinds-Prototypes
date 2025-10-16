import React, { createContext, useContext, useEffect, useState } from 'react';
import { DependencyContainer } from '../../shared/di/DependencyContainer';

/**
 * Contexto de la aplicación
 * Proporciona acceso a los casos de uso y servicios en toda la app
 */
interface AppContextType {
  initialized: boolean;
}

const AppContext = createContext<AppContextType>({
  initialized: false,
});

/**
 * Proveedor del contexto de la aplicación
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Inicializar el contenedor de dependencias
    DependencyContainer.initialize();
    setInitialized(true);
  }, []);

  if (!initialized) {
    // Aquí podrías mostrar una pantalla de carga
    return null;
  }

  return (
    <AppContext.Provider value={{ initialized }}>
      {children}
    </AppContext.Provider>
  );
};

/**
 * Hook para usar el contexto de la aplicación
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
};

