import { UUID } from '../../shared/types';

/**
 * Entidad ReferenciaPersonal
 * Representa una referencia personal de un cliente
 */
export class ReferenciaPersonal {
  constructor(
    public readonly id: UUID,
    public readonly clienteId: UUID,
    public readonly nombre: string,
    public readonly telefono: string,
    public readonly parentesco: string,
    public readonly createdAt: Date = new Date()
  ) {
    this.validar();
  }

  private validar(): void {
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error('El nombre de la referencia es requerido');
    }
    if (!this.telefono || this.telefono.trim().length === 0) {
      throw new Error('El teléfono de la referencia es requerido');
    }
    if (!this.parentesco || this.parentesco.trim().length === 0) {
      throw new Error('El parentesco es requerido');
    }
  }
}

