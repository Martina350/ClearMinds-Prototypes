import { UUID } from '../../shared/types';

/**
 * Entidad Préstamo
 * Representa un préstamo otorgado a un cliente
 */
export class Prestamo {
  constructor(
    public readonly id: UUID,
    public readonly clienteId: UUID,
    public readonly numeroPrestamo: string,
    public readonly montoOriginal: number,
    public readonly montoPendiente: number,
    public readonly tasaInteres: number,
    public readonly plazoMeses: number,
    public readonly fechaOtorgamiento: Date,
    public readonly fechaVencimiento: Date,
    public readonly estado: EstadoPrestamo,
    public readonly cuotas: CuotaPrestamo[],
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validar();
  }

  private validar(): void {
    if (this.montoOriginal <= 0) {
      throw new Error('El monto original debe ser mayor a cero');
    }
    if (this.montoPendiente < 0) {
      throw new Error('El monto pendiente no puede ser negativo');
    }
    if (this.tasaInteres < 0 || this.tasaInteres > 1) {
      throw new Error('La tasa de interés debe estar entre 0 y 1');
    }
  }

  /**
   * Calcula el monto total de mora acumulada
   */
  get montoMora(): number {
    return this.cuotas
      .filter(cuota => cuota.estaVencida && !cuota.estaPagada)
      .reduce((total, cuota) => total + cuota.montoMora, 0);
  }

  /**
   * Calcula el monto total de intereses pendientes
   */
  get montoIntereses(): number {
    return this.cuotas
      .filter(cuota => !cuota.estaPagada)
      .reduce((total, cuota) => total + cuota.montoInteres, 0);
  }

  /**
   * Verifica si el préstamo está vencido
   */
  get estaVencido(): boolean {
    return new Date() > this.fechaVencimiento;
  }

  /**
   * Obtiene las cuotas vencidas
   */
  get cuotasVencidas(): CuotaPrestamo[] {
    return this.cuotas.filter(cuota => cuota.estaVencida && !cuota.estaPagada);
  }

  /**
   * Obtiene las cuotas pendientes
   */
  get cuotasPendientes(): CuotaPrestamo[] {
    return this.cuotas.filter(cuota => !cuota.estaPagada);
  }
}

/**
 * Entidad CuotaPrestamo
 * Representa una cuota individual de un préstamo
 */
export class CuotaPrestamo {
  constructor(
    public readonly id: UUID,
    public readonly prestamoId: UUID,
    public readonly numeroCuota: number,
    public readonly montoCuota: number,
    public readonly montoCapital: number,
    public readonly montoInteres: number,
    public readonly fechaVencimiento: Date,
    public readonly fechaPago?: Date,
    public readonly montoPagado: number = 0,
    public readonly montoMora: number = 0,
    public readonly diasMora: number = 0,
    public readonly estaPagada: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validar();
  }

  private validar(): void {
    if (this.montoCuota <= 0) {
      throw new Error('El monto de la cuota debe ser mayor a cero');
    }
    if (this.montoPagado < 0) {
      throw new Error('El monto pagado no puede ser negativo');
    }
  }

  /**
   * Verifica si la cuota está vencida
   */
  get estaVencida(): boolean {
    return new Date() > this.fechaVencimiento && !this.estaPagada;
  }

  /**
   * Calcula los días de mora
   */
  get diasMoraCalculados(): number {
    if (!this.estaVencida) return 0;
    const hoy = new Date();
    const diferencia = hoy.getTime() - this.fechaVencimiento.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  /**
   * Calcula el monto total a pagar (cuota + mora)
   */
  get montoTotal(): number {
    return this.montoCuota + this.montoMora;
  }

  /**
   * Calcula el monto pendiente de pago
   */
  get montoPendiente(): number {
    return this.montoTotal - this.montoPagado;
  }
}

/**
 * Estados de un préstamo
 */
export enum EstadoPrestamo {
  ACTIVO = 'ACTIVO',
  VENCIDO = 'VENCIDO',
  PAGADO = 'PAGADO',
  CANCELADO = 'CANCELADO',
  EN_MORA = 'EN_MORA'
}
