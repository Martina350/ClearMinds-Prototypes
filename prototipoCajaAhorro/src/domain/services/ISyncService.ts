/**
 * Interfaz del servicio de sincronización
 * Maneja la sincronización de datos entre el dispositivo y el servidor
 */
export interface ISyncService {
  /**
   * Sincroniza todos los datos pendientes con el servidor
   */
  sincronizarTodo(): Promise<void>;

  /**
   * Sincroniza solo las transacciones pendientes
   */
  sincronizarTransacciones(): Promise<void>;

  /**
   * Verifica si hay conexión a internet
   */
  verificarConexion(): Promise<boolean>;

  /**
   * Obtiene la fecha de la última sincronización
   */
  obtenerUltimaSincronizacion(): Promise<Date | null>;

  /**
   * Cuenta cuántos registros están pendientes de sincronización
   */
  contarPendientes(): Promise<number>;
}

