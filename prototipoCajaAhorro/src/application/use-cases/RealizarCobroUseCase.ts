import { Transaccion } from '../../domain/entities/Transaccion';
import { EstadoCobranza } from '../../domain/entities/Cobranza';
import { ICobranzaRepository } from '../../domain/repositories/ICobranzaRepository';
import { ITransaccionRepository } from '../../domain/repositories/ITransaccionRepository';
import { UUID, TipoTransaccion, EstadoTransaccion } from '../../shared/types';

/**
 * DTO para realizar un cobro
 */
export interface RealizarCobroDTO {
  cobranzaId: UUID;
  montoPagado: number;
  agenteId: UUID;
  descripcion?: string;
}

/**
 * Caso de Uso: Realizar Cobro
 * Registra el pago de una cobranza/deuda
 */
export class RealizarCobroUseCase {
  constructor(
    private cobranzaRepository: ICobranzaRepository,
    private transaccionRepository: ITransaccionRepository
  ) {}

  async execute(dto: RealizarCobroDTO): Promise<Transaccion> {
    // Validar monto
    if (dto.montoPagado <= 0) {
      throw new Error('El monto pagado debe ser mayor a cero');
    }

    // Buscar la cobranza
    const cobranza = await this.cobranzaRepository.buscarPorId(dto.cobranzaId);
    if (!cobranza) {
      throw new Error('La cobranza no existe');
    }

    // Verificar que la cobranza esté pendiente
    if (cobranza.estado === EstadoCobranza.PAGADA) {
      throw new Error('Esta cobranza ya ha sido pagada');
    }

    if (cobranza.estado === EstadoCobranza.CANCELADA) {
      throw new Error('Esta cobranza ha sido cancelada');
    }

    // Verificar que el monto pagado no exceda el monto pendiente
    if (dto.montoPagado > cobranza.montoPendiente) {
      throw new Error(
        `El monto pagado ($${dto.montoPagado}) no puede ser mayor al monto pendiente ($${cobranza.montoPendiente})`
      );
    }

    // Calcular nuevo monto pendiente
    const nuevoMontoPendiente = cobranza.montoPendiente - dto.montoPagado;

    // Actualizar la cobranza
    await this.cobranzaRepository.actualizarMontoPendiente(
      dto.cobranzaId,
      nuevoMontoPendiente
    );

    // Si el nuevo monto pendiente es 0, marcar como pagada
    if (nuevoMontoPendiente === 0) {
      await this.cobranzaRepository.marcarComoPagada(dto.cobranzaId);
    }

    // Crear la transacción de cobro
    const transaccion = new Transaccion(
      this.generarUUID(),
      cobranza.cuentaId || '', // Puede ser null si es un cobro sin cuenta asociada
      TipoTransaccion.COBRO,
      dto.montoPagado,
      EstadoTransaccion.COMPLETADA,
      dto.agenteId,
      new Date(),
      this.generarNumeroRecibo(),
      dto.descripcion || `Cobro de ${cobranza.concepto}`,
      dto.cobranzaId
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

