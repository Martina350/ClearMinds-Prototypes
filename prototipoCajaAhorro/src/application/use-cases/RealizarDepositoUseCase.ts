import { Transaccion } from '../../domain/entities/Transaccion';
import { ICuentaRepository } from '../../domain/repositories/ICuentaRepository';
import { ITransaccionRepository } from '../../domain/repositories/ITransaccionRepository';
import { UUID, TipoTransaccion, EstadoTransaccion } from '../../shared/types';

/**
 * DTO para realizar un depósito
 */
export interface RealizarDepositoDTO {
  cuentaId: UUID;
  monto: number;
  agenteId: UUID;
  descripcion?: string;
}

/**
 * Caso de Uso: Realizar Depósito
 * Realiza un depósito en una cuenta existente
 */
export class RealizarDepositoUseCase {
  constructor(
    private cuentaRepository: ICuentaRepository,
    private transaccionRepository: ITransaccionRepository
  ) {}

  async execute(dto: RealizarDepositoDTO): Promise<Transaccion> {
    // Validar monto
    if (dto.monto <= 0) {
      throw new Error('El monto del depósito debe ser mayor a cero');
    }

    // Buscar la cuenta
    const cuenta = await this.cuentaRepository.buscarPorId(dto.cuentaId);
    if (!cuenta) {
      throw new Error('La cuenta no existe');
    }

    // Verificar que la cuenta esté activa
    if (!cuenta.estaActiva) {
      throw new Error('La cuenta no está activa');
    }

    // Calcular nuevo saldo
    const nuevoSaldo = cuenta.saldo + dto.monto;

    // Actualizar el saldo de la cuenta
    await this.cuentaRepository.actualizarSaldo(dto.cuentaId, nuevoSaldo);

    // Crear la transacción
    const transaccion = new Transaccion(
      this.generarUUID(),
      dto.cuentaId,
      TipoTransaccion.DEPOSITO,
      dto.monto,
      EstadoTransaccion.COMPLETADA,
      dto.agenteId,
      new Date(),
      this.generarNumeroRecibo(),
      dto.descripcion || `Depósito en cuenta ${cuenta.numeroCuenta}`
    );

    // Guardar la transacción
    await this.transaccionRepository.guardar(transaccion);

    return transaccion;
  }

  private generarUUID(): UUID {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private generarNumeroRecibo(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REC-${timestamp}-${random}`;
  }
}

