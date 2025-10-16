import { Cobranza, EstadoCobranza } from '../entities/Cobranza';
import { UUID } from '../../shared/types';

/**
 * Interfaz del repositorio de cobranzas
 */
export interface ICobranzaRepository {
  /**
   * Guarda una nueva cobranza o actualiza una existente
   */
  guardar(cobranza: Cobranza): Promise<void>;

  /**
   * Busca una cobranza por su ID
   */
  buscarPorId(id: UUID): Promise<Cobranza | null>;

  /**
   * Obtiene todas las cobranzas de un cliente
   */
  obtenerPorCliente(clienteId: UUID): Promise<Cobranza[]>;

  /**
   * Obtiene cobranzas por estado
   */
  obtenerPorEstado(estado: EstadoCobranza): Promise<Cobranza[]>;

  /**
   * Obtiene cobranzas pendientes de un cliente
   */
  obtenerPendientesPorCliente(clienteId: UUID): Promise<Cobranza[]>;

  /**
   * Obtiene cobranzas vencidas
   */
  obtenerVencidas(): Promise<Cobranza[]>;

  /**
   * Actualiza el monto pendiente de una cobranza
   */
  actualizarMontoPendiente(id: UUID, nuevoMontoPendiente: number): Promise<void>;

  /**
   * Marca una cobranza como pagada
   */
  marcarComoPagada(id: UUID): Promise<void>;
}

