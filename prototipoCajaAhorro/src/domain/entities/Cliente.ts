import { UUID } from '../../shared/types';

/**
 * Entidad Cliente
 * Representa a un cliente del sistema de recaudación
 */
export class Cliente {
  constructor(
    public readonly id: UUID,
    public readonly cedula: string,
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly fechaNacimiento: Date,
    public readonly direccion: string,
    public readonly coordenadas: { latitud: number; longitud: number } | null,
    public readonly celular: string,
    public readonly correo?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validar();
  }

  private validar(): void {
    if (!this.cedula || this.cedula.trim().length === 0) {
      throw new Error('La cédula es requerida');
    }
    if (!this.nombres || this.nombres.trim().length === 0) {
      throw new Error('Los nombres son requeridos');
    }
    if (!this.apellidos || this.apellidos.trim().length === 0) {
      throw new Error('Los apellidos son requeridos');
    }
    if (!this.celular || this.celular.trim().length === 0) {
      throw new Error('El número de celular es requerido');
    }
  }

  get nombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`;
  }

  get edad(): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - this.fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - this.fechaNacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < this.fechaNacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  }
}

