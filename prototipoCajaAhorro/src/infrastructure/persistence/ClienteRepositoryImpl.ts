import { Cliente } from '../../domain/entities/Cliente';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import { UUID } from '../../shared/types';
import { AsyncStorageAdapter } from './AsyncStorageAdapter';

/**
 * Implementación del repositorio de clientes usando AsyncStorage
 */
export class ClienteRepositoryImpl implements IClienteRepository {
  private readonly STORAGE_KEY_PREFIX = 'cliente_';
  private readonly INDEX_KEY = 'clientes_index';

  constructor(private storage: AsyncStorageAdapter) {}

  async guardar(cliente: Cliente): Promise<void> {
    // Guardar el cliente
    await this.storage.guardar(`${this.STORAGE_KEY_PREFIX}${cliente.id}`, {
      id: cliente.id,
      cedula: cliente.cedula,
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      fechaNacimiento: cliente.fechaNacimiento.toISOString(),
      direccion: cliente.direccion,
      coordenadas: cliente.coordenadas,
      celular: cliente.celular,
      correo: cliente.correo,
      createdAt: cliente.createdAt.toISOString(),
      updatedAt: cliente.updatedAt.toISOString(),
    });

    // Actualizar índice
    await this.actualizarIndice(cliente.id);
  }

  async buscarPorId(id: UUID): Promise<Cliente | null> {
    const data = await this.storage.obtener<any>(`${this.STORAGE_KEY_PREFIX}${id}`);
    if (!data) return null;
    return this.mapearACliente(data);
  }

  async buscarPorCedula(cedula: string): Promise<Cliente | null> {
    const clientes = await this.obtenerTodos();
    return clientes.find((c) => c.cedula === cedula) || null;
  }

  async buscarPorNombre(nombre: string): Promise<Cliente[]> {
    const clientes = await this.obtenerTodos();
    const nombreBusqueda = nombre.toLowerCase();
    
    return clientes.filter((c) => {
      const nombreCompleto = c.nombreCompleto.toLowerCase();
      return nombreCompleto.includes(nombreBusqueda);
    });
  }

  async obtenerTodos(): Promise<Cliente[]> {
    const index = await this.storage.obtener<string[]>(this.INDEX_KEY) || [];
    const clientes: Cliente[] = [];

    for (const id of index) {
      const cliente = await this.buscarPorId(id);
      if (cliente) clientes.push(cliente);
    }

    return clientes;
  }

  async eliminar(id: UUID): Promise<void> {
    await this.storage.eliminar(`${this.STORAGE_KEY_PREFIX}${id}`);
    await this.removerDeIndice(id);
  }

  private async actualizarIndice(id: UUID): Promise<void> {
    const index = await this.storage.obtener<string[]>(this.INDEX_KEY) || [];
    if (!index.includes(id)) {
      index.push(id);
      await this.storage.guardar(this.INDEX_KEY, index);
    }
  }

  private async removerDeIndice(id: UUID): Promise<void> {
    const index = await this.storage.obtener<string[]>(this.INDEX_KEY) || [];
    const nuevoIndex = index.filter((i) => i !== id);
    await this.storage.guardar(this.INDEX_KEY, nuevoIndex);
  }

  private mapearACliente(data: any): Cliente {
    return new Cliente(
      data.id,
      data.cedula,
      data.nombres,
      data.apellidos,
      new Date(data.fechaNacimiento),
      data.direccion,
      data.coordenadas,
      data.celular,
      data.correo,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }
}

