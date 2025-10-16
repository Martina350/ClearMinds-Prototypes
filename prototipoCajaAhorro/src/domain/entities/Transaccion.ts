import { UUID, TipoTransaccion, EstadoTransaccion } from '../../shared/types';

/**
 * Entidad Transaccion
 * Representa una transacción financiera (depósito, cobro, etc.)
 */
export class Transaccion {
  constructor(
    public readonly id: UUID,
    public readonly cuentaId: UUID,
    public readonly tipo: TipoTransaccion,
    public readonly monto: number,
    public readonly estado: EstadoTransaccion,
    public readonly agenteId: UUID,
    public readonly fecha: Date,
    public readonly numeroRecibo?: string,
    public readonly descripcion?: string,
    public readonly cobranzaId?: UUID, // Si es un cobro, referencia a la cobranza
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
    public readonly sincronizadaAt?: Date
  ) {
    this.validar();
  }

  private validar(): void {
    if (this.monto <= 0) {
      throw new Error('El monto debe ser mayor a cero');
    }
    if (!this.agenteId) {
      throw new Error('El ID del agente es requerido');
    }
  }

  /**
   * Verifica si la transacción ha sido sincronizada con el servidor
   */
  get estaSincronizada(): boolean {
    return this.estado === EstadoTransaccion.SINCRONIZADA;
  }

  /**
   * Verifica si la transacción está completada
   */
  get estaCompletada(): boolean {
    return this.estado === EstadoTransaccion.COMPLETADA || 
           this.estado === EstadoTransaccion.SINCRONIZADA;
  }
}

