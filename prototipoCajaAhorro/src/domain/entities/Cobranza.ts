import { UUID } from '../../shared/types';

export enum EstadoCobranza {
  PENDIENTE = 'PENDIENTE',
  PAGADA = 'PAGADA',
  VENCIDA = 'VENCIDA',
  CANCELADA = 'CANCELADA',
}

/**
 * Entidad Cobranza
 * Representa una deuda/cobro pendiente de un cliente
 */
export class Cobranza {
  constructor(
    public readonly id: UUID,
    public readonly clienteId: UUID,
    public readonly cuentaId: UUID | null,
    public readonly montoPendiente: number,
    public readonly montoOriginal: number,
    public readonly fechaVencimiento: Date,
    public readonly estado: EstadoCobranza,
    public readonly concepto: string,
    public readonly fechaCreacion: Date = new Date(),
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validar();
  }

  private validar(): void {
    if (this.montoPendiente < 0) {
      throw new Error('El monto pendiente no puede ser negativo');
    }
    if (this.montoOriginal <= 0) {
      throw new Error('El monto original debe ser mayor a cero');
    }
    if (this.montoPendiente > this.montoOriginal) {
      throw new Error('El monto pendiente no puede ser mayor al monto original');
    }
  }

  /**
   * Verifica si la cobranza está vencida
   */
  get estaVencida(): boolean {
    return new Date() > this.fechaVencimiento && 
           this.estado === EstadoCobranza.PENDIENTE;
  }

  /**
   * Verifica si la cobranza está pagada
   */
  get estaPagada(): boolean {
    return this.estado === EstadoCobranza.PAGADA || this.montoPendiente === 0;
  }

  /**
   * Calcula el porcentaje pagado
   */
  get porcentajePagado(): number {
    return ((this.montoOriginal - this.montoPendiente) / this.montoOriginal) * 100;
  }
}

