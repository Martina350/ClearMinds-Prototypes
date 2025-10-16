import { Agente } from '../entities/Agente';
import { UUID } from '../../shared/types';

/**
 * Interfaz del repositorio de agentes
 */
export interface IAgenteRepository {
  /**
   * Guarda un nuevo agente o actualiza uno existente
   */
  guardar(agente: Agente): Promise<void>;

  /**
   * Busca un agente por su ID
   */
  buscarPorId(id: UUID): Promise<Agente | null>;

  /**
   * Busca un agente por su nombre de usuario
   */
  buscarPorUsuario(usuario: string): Promise<Agente | null>;

  /**
   * Busca un agente por su cédula
   */
  buscarPorCedula(cedula: string): Promise<Agente | null>;

  /**
   * Obtiene todos los agentes activos
   */
  obtenerActivos(): Promise<Agente[]>;

  /**
   * Obtiene todos los agentes
   */
  obtenerTodos(): Promise<Agente[]>;
}

