import { UUID, TipoCuenta, EstadoCuenta, PlazoAhorroFuturo } from '../../shared/types';

/**
 * Entidad Cuenta
 * Representa una cuenta bancaria de un cliente
 */
export class Cuenta {
  constructor(
    public readonly id: UUID,
    public readonly numeroCuenta: string,
    public readonly clienteId: UUID,
    public readonly tipo: TipoCuenta,
    public readonly saldo: number,
    public readonly estado: EstadoCuenta,
    public readonly fechaApertura: Date,
    // Campos específicos para cuenta infantil
    public readonly menorId?: UUID,
    public readonly responsableId?: UUID,
    // Campos específicos para ahorro futuro
    public readonly plazoAhorro?: PlazoAhorroFuturo,
    public readonly fechaVencimiento?: Date,
    public readonly montoObjetivo?: number,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validar();
  }

  private validar(): void {
    if (!this.numeroCuenta || this.numeroCuenta.trim().length === 0) {
      throw new Error('El número de cuenta es requerido');
    }
    if (this.saldo < 0) {
      throw new Error('El saldo no puede ser negativo');
    }
    if (this.tipo === TipoCuenta.AHORRO_INFANTIL && (!this.menorId || !this.responsableId)) {
      throw new Error('Una cuenta infantil requiere el ID del menor y del responsable');
    }
    if (this.tipo === TipoCuenta.AHORRO_FUTURO && !this.plazoAhorro) {
      throw new Error('Una cuenta de ahorro futuro requiere un plazo definido');
    }
  }

  /**
   * Verifica si la cuenta está activa
   */
  get estaActiva(): boolean {
    return this.estado === EstadoCuenta.ACTIVA;
  }

  /**
   * Calcula los días restantes para el vencimiento (solo para ahorro futuro)
   */
  get diasRestantes(): number | null {
    if (this.tipo !== TipoCuenta.AHORRO_FUTURO || !this.fechaVencimiento) {
      return null;
    }
    const hoy = new Date();
    const diferencia = this.fechaVencimiento.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  /**
   * Verifica si la cuenta de ahorro futuro ha vencido
   */
  get haVencido(): boolean {
    if (this.tipo !== TipoCuenta.AHORRO_FUTURO || !this.fechaVencimiento) {
      return false;
    }
    return new Date() >= this.fechaVencimiento;
  }
}

