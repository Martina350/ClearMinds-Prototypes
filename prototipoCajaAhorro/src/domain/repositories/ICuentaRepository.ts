import { Cuenta } from '../entities/Cuenta';
import { UUID, TipoCuenta } from '../../shared/types';

/**
 * Interfaz del repositorio de cuentas
 */
export interface ICuentaRepository {
  /**
   * Guarda una nueva cuenta o actualiza una existente
   */
  guardar(cuenta: Cuenta): Promise<void>;

  /**
   * Busca una cuenta por su ID
   */
  buscarPorId(id: UUID): Promise<Cuenta | null>;

  /**
   * Busca una cuenta por su número de cuenta
   */
  buscarPorNumeroCuenta(numeroCuenta: string): Promise<Cuenta | null>;

  /**
   * Obtiene todas las cuentas de un cliente
   */
  obtenerPorCliente(clienteId: UUID): Promise<Cuenta[]>;

  /**
   * Obtiene todas las cuentas de un tipo específico
   */
  obtenerPorTipo(tipo: TipoCuenta): Promise<Cuenta[]>;

  /**
   * Actualiza el saldo de una cuenta
   */
  actualizarSaldo(id: UUID, nuevoSaldo: number): Promise<void>;

  /**
   * Obtiene todas las cuentas
   */
  obtenerTodas(): Promise<Cuenta[]>;
}

