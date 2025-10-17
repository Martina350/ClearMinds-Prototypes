import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AddressData {
  lat: number;
  lng: number;
  formattedAddress: string;
  source: 'gps' | 'manual' | 'map';
  capturedAt: string;
}

export interface StoredAddressData extends AddressData {
  id: string;
  clientId?: string;
  synced: boolean;
  createdAt: string;
}

/**
 * Servicio para manejar el almacenamiento offline de direcciones
 */
export class AddressStorageService {
  private static readonly STORAGE_KEY = 'pending_addresses';
  private static readonly SYNC_QUEUE_KEY = 'address_sync_queue';

  /**
   * Guarda una dirección localmente para sincronización posterior
   */
  static async saveAddressOffline(addressData: AddressData, clientId?: string): Promise<string> {
    try {
      const storedAddress: StoredAddressData = {
        ...addressData,
        id: this.generateId(),
        clientId,
        synced: false,
        createdAt: new Date().toISOString(),
      };

      const existingAddresses = await this.getPendingAddresses();
      const updatedAddresses = [...existingAddresses, storedAddress];

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedAddresses));
      
      return storedAddress.id;
    } catch (error) {
      console.error('Error guardando dirección offline:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las direcciones pendientes de sincronización
   */
  static async getPendingAddresses(): Promise<StoredAddressData[]> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error obteniendo direcciones pendientes:', error);
      return [];
    }
  }

  /**
   * Marca una dirección como sincronizada
   */
  static async markAsSynced(addressId: string): Promise<void> {
    try {
      const addresses = await this.getPendingAddresses();
      const updatedAddresses = addresses.map(addr => 
        addr.id === addressId ? { ...addr, synced: true } : addr
      );

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedAddresses));
    } catch (error) {
      console.error('Error marcando dirección como sincronizada:', error);
      throw error;
    }
  }

  /**
   * Elimina direcciones ya sincronizadas
   */
  static async cleanupSyncedAddresses(): Promise<void> {
    try {
      const addresses = await this.getPendingAddresses();
      const pendingAddresses = addresses.filter(addr => !addr.synced);

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(pendingAddresses));
    } catch (error) {
      console.error('Error limpiando direcciones sincronizadas:', error);
      throw error;
    }
  }

  /**
   * Obtiene direcciones por cliente
   */
  static async getAddressesByClient(clientId: string): Promise<StoredAddressData[]> {
    try {
      const addresses = await this.getPendingAddresses();
      return addresses.filter(addr => addr.clientId === clientId);
    } catch (error) {
      console.error('Error obteniendo direcciones por cliente:', error);
      return [];
    }
  }

  /**
   * Sincroniza direcciones pendientes con el servidor
   */
  static async syncPendingAddresses(): Promise<{ success: number; failed: number }> {
    try {
      const pendingAddresses = await this.getPendingAddresses();
      let successCount = 0;
      let failedCount = 0;

      for (const address of pendingAddresses) {
        try {
          // Aquí iría la llamada al API del servidor
          await this.syncAddressToServer(address);
          await this.markAsSynced(address.id);
          successCount++;
        } catch (error) {
          console.error(`Error sincronizando dirección ${address.id}:`, error);
          failedCount++;
        }
      }

      // Limpiar direcciones sincronizadas
      await this.cleanupSyncedAddresses();

      return { success: successCount, failed: failedCount };
    } catch (error) {
      console.error('Error en sincronización general:', error);
      throw error;
    }
  }

  /**
   * Simula la sincronización con el servidor
   * En una implementación real, aquí harías la llamada HTTP
   */
  private static async syncAddressToServer(address: StoredAddressData): Promise<void> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular éxito/fallo ocasional
    if (Math.random() < 0.1) { // 10% de fallo
      throw new Error('Error de red simulado');
    }

    console.log('Dirección sincronizada:', address.id);
  }

  /**
   * Genera un ID único para la dirección
   */
  private static generateId(): string {
    return `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene estadísticas de sincronización
   */
  static async getSyncStats(): Promise<{ pending: number; synced: number; total: number }> {
    try {
      const addresses = await this.getPendingAddresses();
      const pending = addresses.filter(addr => !addr.synced).length;
      const synced = addresses.filter(addr => addr.synced).length;
      
      return {
        pending,
        synced,
        total: addresses.length,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { pending: 0, synced: 0, total: 0 };
    }
  }
}
