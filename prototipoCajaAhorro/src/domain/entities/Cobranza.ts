import { UUID } from '../../shared/types';

export enum EstadoCobranza {
  PENDIENTE = 'PENDIENTE',
  PAGADA = 'PAGADA',
  VENCIDA = 'VENCIDA',
  CANCELADA = 'CANCELADA',
}

export enum TipoCobranza {
  PRESTAMO = 'PRESTAMO',
  CUOTA_PRESTAMO = 'CUOTA_PRESTAMO',
  MORA = 'MORA',
  INTERES = 'INTERES',
  OTRO = 'OTRO',
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
    public readonly prestamoId: UUID | null,
    public readonly cuotaId: UUID | null,
    public readonly montoPendiente: number,
    public readonly montoOriginal: number,
    public readonly montoMora: number,
    public readonly montoInteres: number,
    public readonly fechaVencimiento: Date,
    public readonly estado: EstadoCobranza,
    public readonly tipo: TipoCobranza,
    public readonly concepto: string,
    public readonly numeroCuota?: number,
    public readonly diasMora: number = 0,
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

  /**
   * Calcula el monto total a pagar (principal + mora + interés)
   */
  get montoTotal(): number {
    return this.montoPendiente + this.montoMora + this.montoInteres;
  }

  /**
   * Verifica si tiene mora
   */
  get tieneMora(): boolean {
    return this.montoMora > 0 || this.diasMora > 0;
  }

  /**
   * Obtiene la descripción detallada
   */
  get descripcionDetallada(): string {
    let descripcion = this.concepto;
    if (this.numeroCuota) {
      descripcion += ` - Cuota ${this.numeroCuota}`;
    }
    if (this.tieneMora) {
      descripcion += ` (${this.diasMora} días de mora)`;
    }
    return descripcion;
  }
}

