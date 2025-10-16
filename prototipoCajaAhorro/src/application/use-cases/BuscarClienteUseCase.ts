import { Cliente } from '../../domain/entities/Cliente';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';

/**
 * DTO para buscar clientes
 */
export interface BuscarClienteDTO {
  cedula?: string;
  nombre?: string;
}

/**
 * Caso de Uso: Buscar Cliente
 * Busca clientes por cédula o nombre
 */
export class BuscarClienteUseCase {
  constructor(private clienteRepository: IClienteRepository) {}

  async execute(dto: BuscarClienteDTO): Promise<Cliente[]> {
    // Si se proporciona cédula, buscar por cédula (búsqueda exacta)
    if (dto.cedula) {
      const cliente = await this.clienteRepository.buscarPorCedula(dto.cedula);
      return cliente ? [cliente] : [];
    }

    // Si se proporciona nombre, buscar por nombre (búsqueda parcial)
    if (dto.nombre) {
      return await this.clienteRepository.buscarPorNombre(dto.nombre);
    }

    // Si no se proporciona ningún criterio, retornar array vacío
    return [];
  }
}

