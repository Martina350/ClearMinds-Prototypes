/**
 * Contenedor de Inyección de Dependencias
 * 
 * Este contenedor centraliza la creación de todas las dependencias de la aplicación,
 * siguiendo el principio de Inversión de Dependencias (Dependency Inversion).
 * 
 * Las capas externas (Infraestructura) implementan las interfaces definidas
 * en las capas internas (Dominio), y este contenedor se encarga de conectarlas.
 */

// Repositorios
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import { ICuentaRepository } from '../../domain/repositories/ICuentaRepository';
import { ITransaccionRepository } from '../../domain/repositories/ITransaccionRepository';
import { ICobranzaRepository } from '../../domain/repositories/ICobranzaRepository';
import { IAgenteRepository } from '../../domain/repositories/IAgenteRepository';
import { IReferenciaPersonalRepository } from '../../domain/repositories/IReferenciaPersonalRepository';

// Servicios
import { ILocationService } from '../../domain/services/ILocationService';
import { IPrintService } from '../../domain/services/IPrintService';
import { IAuthService } from '../../domain/services/IAuthService';
import { ISyncService } from '../../domain/services/ISyncService';

// Implementaciones de infraestructura
import { AsyncStorageAdapter } from '../../infrastructure/persistence/AsyncStorageAdapter';
import { ClienteRepositoryImpl } from '../../infrastructure/persistence/ClienteRepositoryImpl';
import { ExpoLocationService } from '../../infrastructure/location/ExpoLocationService';
import { PrintServiceImpl } from '../../infrastructure/printing/PrintServiceImpl';

// Casos de uso
import { CrearClienteUseCase } from '../../application/use-cases/CrearClienteUseCase';
import { AbrirCuentaUseCase } from '../../application/use-cases/AbrirCuentaUseCase';
import { RealizarDepositoUseCase } from '../../application/use-cases/RealizarDepositoUseCase';
import { RealizarCobroUseCase } from '../../application/use-cases/RealizarCobroUseCase';
import { BuscarClienteUseCase } from '../../application/use-cases/BuscarClienteUseCase';
import { ObtenerDashboardUseCase } from '../../application/use-cases/ObtenerDashboardUseCase';

/**
 * Clase que contiene todas las dependencias de la aplicación
 */
export class DependencyContainer {
  // Servicios de infraestructura
  private static storageAdapter: AsyncStorageAdapter;
  private static locationService: ILocationService;
  private static printService: IPrintService;

  // Repositorios
  private static clienteRepository: IClienteRepository;
  private static cuentaRepository: ICuentaRepository;
  private static transaccionRepository: ITransaccionRepository;
  private static cobranzaRepository: ICobranzaRepository;
  private static agenteRepository: IAgenteRepository;
  private static referenciaPersonalRepository: IReferenciaPersonalRepository;

  // Casos de uso
  private static crearClienteUseCase: CrearClienteUseCase;
  private static abrirCuentaUseCase: AbrirCuentaUseCase;
  private static realizarDepositoUseCase: RealizarDepositoUseCase;
  private static realizarCobroUseCase: RealizarCobroUseCase;
  private static buscarClienteUseCase: BuscarClienteUseCase;
  private static obtenerDashboardUseCase: ObtenerDashboardUseCase;

  /**
   * Inicializa todas las dependencias
   */
  static initialize(): void {
    // Inicializar servicios de infraestructura
    this.storageAdapter = new AsyncStorageAdapter();
    this.locationService = new ExpoLocationService();
    this.printService = new PrintServiceImpl();

    // Inicializar repositorios (por ahora solo Cliente está implementado)
    this.clienteRepository = new ClienteRepositoryImpl(this.storageAdapter);
    // TODO: Implementar los demás repositorios
    // this.cuentaRepository = new CuentaRepositoryImpl(this.storageAdapter);
    // this.transaccionRepository = new TransaccionRepositoryImpl(this.storageAdapter);
    // this.cobranzaRepository = new CobranzaRepositoryImpl(this.storageAdapter);
    // this.agenteRepository = new AgenteRepositoryImpl(this.storageAdapter);
    // this.referenciaPersonalRepository = new ReferenciaPersonalRepositoryImpl(this.storageAdapter);
  }

  /**
   * Obtiene el caso de uso para crear clientes
   */
  static getCrearClienteUseCase(): CrearClienteUseCase {
    if (!this.crearClienteUseCase) {
      // Crear mock de referencia personal repository por ahora
      const mockReferenciaRepo: IReferenciaPersonalRepository = {
        guardar: async () => {},
        obtenerPorCliente: async () => [],
        eliminar: async () => {},
      };

      this.crearClienteUseCase = new CrearClienteUseCase(
        this.clienteRepository,
        mockReferenciaRepo,
        this.locationService
      );
    }
    return this.crearClienteUseCase;
  }

  /**
   * Obtiene el caso de uso para buscar clientes
   */
  static getBuscarClienteUseCase(): BuscarClienteUseCase {
    if (!this.buscarClienteUseCase) {
      this.buscarClienteUseCase = new BuscarClienteUseCase(
        this.clienteRepository
      );
    }
    return this.buscarClienteUseCase;
  }

  /**
   * Obtiene el servicio de ubicación
   */
  static getLocationService(): ILocationService {
    return this.locationService;
  }

  /**
   * Obtiene el servicio de impresión
   */
  static getPrintService(): IPrintService {
    return this.printService;
  }

  /**
   * Obtiene el repositorio de clientes
   */
  static getClienteRepository(): IClienteRepository {
    return this.clienteRepository;
  }
}

