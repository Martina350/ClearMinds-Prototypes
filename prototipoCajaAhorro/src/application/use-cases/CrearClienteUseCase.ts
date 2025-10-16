import { Cliente } from '../../domain/entities/Cliente';
import { ReferenciaPersonal } from '../../domain/entities/ReferenciaPersonal';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import { IReferenciaPersonalRepository } from '../../domain/repositories/IReferenciaPersonalRepository';
import { ILocationService } from '../../domain/services/ILocationService';
import { UUID } from '../../shared/types';

/**
 * Datos de entrada para crear un cliente
 */
export interface CrearClienteDTO {
  cedula: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  direccion: string;
  celular: string;
  correo?: string;
  obtenerUbicacionGPS: boolean;
  referencias: Array<{
    nombre: string;
    telefono: string;
    parentesco: string;
  }>;
}

/**
 * Caso de Uso: Crear Cliente
 * Crea un nuevo cliente con sus referencias personales
 */
export class CrearClienteUseCase {
  constructor(
    private clienteRepository: IClienteRepository,
    private referenciaRepository: IReferenciaPersonalRepository,
    private locationService: ILocationService
  ) {}

  async execute(dto: CrearClienteDTO): Promise<Cliente> {
    // Verificar que el cliente no exista
    const clienteExistente = await this.clienteRepository.buscarPorCedula(dto.cedula);
    if (clienteExistente) {
      throw new Error('Ya existe un cliente con esta cédula');
    }

    // Obtener coordenadas GPS si se solicita
    let coordenadas = null;
    if (dto.obtenerUbicacionGPS) {
      try {
        coordenadas = await this.locationService.obtenerCoordenadas();
      } catch (error) {
        console.warn('No se pudieron obtener las coordenadas GPS', error);
      }
    }

    // Crear el cliente
    const clienteId = this.generarUUID();
    const cliente = new Cliente(
      clienteId,
      dto.cedula,
      dto.nombres,
      dto.apellidos,
      dto.fechaNacimiento,
      dto.direccion,
      coordenadas,
      dto.celular,
      dto.correo
    );

    // Guardar el cliente
    await this.clienteRepository.guardar(cliente);

    // Guardar las referencias personales
    for (const refData of dto.referencias) {
      const referencia = new ReferenciaPersonal(
        this.generarUUID(),
        clienteId,
        refData.nombre,
        refData.telefono,
        refData.parentesco
      );
      await this.referenciaRepository.guardar(referencia);
    }

    return cliente;
  }

  private generarUUID(): UUID {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

