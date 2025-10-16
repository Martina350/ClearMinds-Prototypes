import { ReferenciaPersonal } from '../entities/ReferenciaPersonal';
import { UUID } from '../../shared/types';

/**
 * Interfaz del repositorio de referencias personales
 */
export interface IReferenciaPersonalRepository {
  /**
   * Guarda una nueva referencia personal
   */
  guardar(referencia: ReferenciaPersonal): Promise<void>;

  /**
   * Obtiene todas las referencias de un cliente
   */
  obtenerPorCliente(clienteId: UUID): Promise<ReferenciaPersonal[]>;

  /**
   * Elimina una referencia personal
   */
  eliminar(id: UUID): Promise<void>;
}

