import { Transaccion } from '../entities/Transaccion';
import { UUID, TipoTransaccion } from '../../shared/types';

/**
 * Interfaz del repositorio de transacciones
 */
export interface ITransaccionRepository {
  /**
   * Guarda una nueva transacción
   */
  guardar(transaccion: Transaccion): Promise<void>;

  /**
   * Busca una transacción por su ID
   */
  buscarPorId(id: UUID): Promise<Transaccion | null>;

  /**
   * Obtiene todas las transacciones de una cuenta
   */
  obtenerPorCuenta(cuentaId: UUID): Promise<Transaccion[]>;

  /**
   * Obtiene todas las transacciones de un agente
   */
  obtenerPorAgente(agenteId: UUID): Promise<Transaccion[]>;

  /**
   * Obtiene transacciones por rango de fechas
   */
  obtenerPorFechas(fechaInicio: Date, fechaFin: Date): Promise<Transaccion[]>;

  /**
   * Obtiene transacciones por tipo
   */
  obtenerPorTipo(tipo: TipoTransaccion): Promise<Transaccion[]>;

  /**
   * Obtiene transacciones pendientes de sincronización
   */
  obtenerPendientesSincronizacion(): Promise<Transaccion[]>;

  /**
   * Marca una transacción como sincronizada
   */
  marcarComoSincronizada(id: UUID): Promise<void>;

  /**
   * Obtiene todas las transacciones
   */
  obtenerTodas(): Promise<Transaccion[]>;
}

