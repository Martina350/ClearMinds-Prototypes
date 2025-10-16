import { UUID } from '../../shared/types';

export enum RolAgente {
  RECAUDADOR = 'RECAUDADOR',
  SUPERVISOR = 'SUPERVISOR',
  ADMINISTRADOR = 'ADMINISTRADOR',
}

/**
 * Entidad Agente
 * Representa un agente/usuario del sistema de recaudación
 */
export class Agente {
  constructor(
    public readonly id: UUID,
    public readonly cedula: string,
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly usuario: string,
    public readonly rol: RolAgente,
    public readonly activo: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    this.validar();
  }

  private validar(): void {
    if (!this.cedula || this.cedula.trim().length === 0) {
      throw new Error('La cédula es requerida');
    }
    if (!this.usuario || this.usuario.trim().length === 0) {
      throw new Error('El usuario es requerido');
    }
    if (!this.nombres || this.nombres.trim().length === 0) {
      throw new Error('Los nombres son requeridos');
    }
  }

  get nombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`;
  }

  /**
   * Verifica si el agente tiene permisos de administrador
   */
  get esAdministrador(): boolean {
    return this.rol === RolAgente.ADMINISTRADOR;
  }

  /**
   * Verifica si el agente tiene permisos de supervisor
   */
  get esSupervisor(): boolean {
    return this.rol === RolAgente.SUPERVISOR || this.rol === RolAgente.ADMINISTRADOR;
  }
}

