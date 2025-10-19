import { Transaccion } from '../entities/Transaccion';
import { Cliente } from '../entities/Cliente';
import { Cuenta } from '../entities/Cuenta';
import { Cobranza } from '../entities/Cobranza';

/**
 * Interfaz del servicio de sincronización
 * Maneja la sincronización de datos entre el dispositivo y el servidor
 */
export interface ISyncService {
  /**
   * Verifica si hay conexión a internet
   */
  verificarConexion(): Promise<boolean>;

  /**
   * Sincroniza transacciones pendientes
   */
  sincronizarTransacciones(transacciones: Transaccion[]): Promise<boolean>;

  /**
   * Sincroniza clientes
   */
  sincronizarClientes(clientes: Cliente[]): Promise<boolean>;

  /**
   * Sincroniza cuentas
   */
  sincronizarCuentas(cuentas: Cuenta[]): Promise<boolean>;

  /**
   * Sincroniza cobranzas
   */
  sincronizarCobranzas(cobranzas: Cobranza[]): Promise<boolean>;

  /**
   * Sincronización completa
   */
  sincronizarTodo(datos: {
    transacciones: Transaccion[];
    clientes: Cliente[];
    cuentas: Cuenta[];
    cobranzas: Cobranza[];
  }): Promise<{
    exitoso: boolean;
    detalles: {
      transacciones: boolean;
      clientes: boolean;
      cuentas: boolean;
      cobranzas: boolean;
    };
  }>;

  /**
   * Obtiene datos del servidor
   */
  obtenerDatosDelServidor(): Promise<{
    clientes: Cliente[];
    cuentas: Cuenta[];
    cobranzas: Cobranza[];
  }>;
}

