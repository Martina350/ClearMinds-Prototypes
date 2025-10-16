import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Adaptador para AsyncStorage
 * Proporciona métodos simplificados para almacenamiento local
 */
export class AsyncStorageAdapter {
  /**
   * Guarda un valor en el storage
   */
  async guardar<T>(clave: string, valor: T): Promise<void> {
    try {
      const valorString = JSON.stringify(valor);
      await AsyncStorage.setItem(clave, valorString);
    } catch (error) {
      console.error(`Error al guardar ${clave}:`, error);
      throw new Error(`No se pudo guardar ${clave}`);
    }
  }

  /**
   * Obtiene un valor del storage
   */
  async obtener<T>(clave: string): Promise<T | null> {
    try {
      const valorString = await AsyncStorage.getItem(clave);
      if (!valorString) return null;
      return JSON.parse(valorString) as T;
    } catch (error) {
      console.error(`Error al obtener ${clave}:`, error);
      return null;
    }
  }

  /**
   * Elimina un valor del storage
   */
  async eliminar(clave: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(clave);
    } catch (error) {
      console.error(`Error al eliminar ${clave}:`, error);
      throw new Error(`No se pudo eliminar ${clave}`);
    }
  }

  /**
   * Obtiene todas las claves que coincidan con un prefijo
   */
  async obtenerClavesPorPrefijo(prefijo: string): Promise<string[]> {
    try {
      const todasLasClaves = await AsyncStorage.getAllKeys();
      return todasLasClaves.filter((clave) => clave.startsWith(prefijo));
    } catch (error) {
      console.error('Error al obtener claves:', error);
      return [];
    }
  }

  /**
   * Obtiene múltiples valores a la vez
   */
  async obtenerMultiples<T>(claves: string[]): Promise<Map<string, T>> {
    try {
      const pares = await AsyncStorage.multiGet(claves);
      const resultado = new Map<string, T>();
      
      pares.forEach(([clave, valor]) => {
        if (valor) {
          try {
            resultado.set(clave, JSON.parse(valor) as T);
          } catch (error) {
            console.warn(`Error al parsear valor de ${clave}`);
          }
        }
      });
      
      return resultado;
    } catch (error) {
      console.error('Error al obtener múltiples valores:', error);
      return new Map();
    }
  }

  /**
   * Limpia todo el storage (usar con precaución)
   */
  async limpiarTodo(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error al limpiar storage:', error);
      throw new Error('No se pudo limpiar el storage');
    }
  }
}

