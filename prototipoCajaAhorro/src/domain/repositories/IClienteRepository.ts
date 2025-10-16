import { Cliente } from '../entities/Cliente';
import { UUID } from '../../shared/types';

/**
 * Interfaz del repositorio de clientes
 * Define los contratos para acceder a los datos de clientes
 * La implementación concreta estará en la capa de infraestructura
 */
export interface IClienteRepository {
  /**
   * Guarda un nuevo cliente o actualiza uno existente
   */
  guardar(cliente: Cliente): Promise<void>;

  /**
   * Busca un cliente por su ID
   */
  buscarPorId(id: UUID): Promise<Cliente | null>;

  /**
   * Busca un cliente por su número de cédula
   */
  buscarPorCedula(cedula: string): Promise<Cliente | null>;

  /**
   * Busca clientes por nombre (búsqueda parcial)
   */
  buscarPorNombre(nombre: string): Promise<Cliente[]>;

  /**
   * Obtiene todos los clientes
   */
  obtenerTodos(): Promise<Cliente[]>;

  /**
   * Elimina un cliente
   */
  eliminar(id: UUID): Promise<void>;
}

