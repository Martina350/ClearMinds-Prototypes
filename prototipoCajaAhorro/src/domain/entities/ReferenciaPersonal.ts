import { UUID } from '../../shared/types';

export enum TipoParentesco {
  PADRE = 'PADRE',
  MADRE = 'MADRE',
  HERMANO = 'HERMANO',
  HERMANA = 'HERMANA',
  ESPOSO = 'ESPOSO',
  ESPOSA = 'ESPOSA',
  HIJO = 'HIJO',
  HIJA = 'HIJA',
  TIO = 'TIO',
  TIA = 'TIA',
  PRIMO = 'PRIMO',
  PRIMA = 'PRIMA',
  AMIGO = 'AMIGO',
  AMIGA = 'AMIGA',
  VECINO = 'VECINO',
  VECINA = 'VECINA',
  OTRO = 'OTRO'
}

/**
 * Entidad ReferenciaPersonal
 * Representa una referencia personal de un cliente
 */
export class ReferenciaPersonal {
  constructor(
    public readonly id: UUID,
    public readonly clienteId: UUID,
    public readonly nombre: string,
    public readonly apellidos: string,
    public readonly telefono: string,
    public readonly parentesco: TipoParentesco,
    public readonly parentescoOtro?: string,
    public readonly direccion?: string,
    public readonly esPrincipal: boolean = false,
    public readonly esContactoEmergencia: boolean = false,
    public readonly observaciones?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validar();
  }

  private validar(): void {
    if (!this.nombre || this.nombre.trim().length === 0) {
      throw new Error('El nombre de la referencia es requerido');
    }
    if (!this.apellidos || this.apellidos.trim().length === 0) {
      throw new Error('Los apellidos de la referencia son requeridos');
    }
    if (!this.telefono || this.telefono.trim().length === 0) {
      throw new Error('El teléfono de la referencia es requerido');
    }
    if (!this.parentesco) {
      throw new Error('El parentesco es requerido');
    }
    if (this.parentesco === TipoParentesco.OTRO && (!this.parentescoOtro || this.parentescoOtro.trim().length === 0)) {
      throw new Error('Debe especificar el parentesco cuando selecciona "Otro"');
    }
  }

  /**
   * Obtiene el nombre completo de la referencia
   */
  get nombreCompleto(): string {
    return `${this.nombre} ${this.apellidos}`;
  }

  /**
   * Obtiene la descripción del parentesco
   */
  get descripcionParentesco(): string {
    if (this.parentesco === TipoParentesco.OTRO && this.parentescoOtro) {
      return this.parentescoOtro;
    }
    return this.parentesco;
  }

  /**
   * Verifica si es una referencia válida para contacto de emergencia
   */
  get esValidaParaEmergencia(): boolean {
    return this.telefono.length >= 10 && this.nombre.trim().length > 0;
  }
}

