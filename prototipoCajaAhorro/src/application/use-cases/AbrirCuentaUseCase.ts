import { Cuenta } from '../../domain/entities/Cuenta';
import { Transaccion } from '../../domain/entities/Transaccion';
import { IClienteRepository } from '../../domain/repositories/IClienteRepository';
import { ICuentaRepository } from '../../domain/repositories/ICuentaRepository';
import { ITransaccionRepository } from '../../domain/repositories/ITransaccionRepository';
import { 
  UUID, 
  TipoCuenta, 
  EstadoCuenta, 
  PlazoAhorroFuturo,
  TipoTransaccion,
  EstadoTransaccion 
} from '../../shared/types';

/**
 * DTO para abrir cuenta básica
 */
export interface AbrirCuentaBasicaDTO {
  tipo: 'BASICA';
  clienteId: UUID;
  montoInicial: number;
  agenteId: UUID;
}

/**
 * DTO para abrir cuenta infantil
 */
export interface AbrirCuentaInfantilDTO {
  tipo: 'INFANTIL';
  clienteId: UUID; // Cliente titular (adulto responsable)
  menorId: UUID;
  montoInicial: number;
  agenteId: UUID;
}

/**
 * DTO para abrir cuenta de ahorro futuro
 */
export interface AbrirCuentaAhorroFuturoDTO {
  tipo: 'AHORRO_FUTURO';
  clienteId: UUID;
  montoInicial: number;
  plazoAhorro: PlazoAhorroFuturo;
  montoObjetivo?: number;
  agenteId: UUID;
}

export type AbrirCuentaDTO = 
  | AbrirCuentaBasicaDTO 
  | AbrirCuentaInfantilDTO 
  | AbrirCuentaAhorroFuturoDTO;

/**
 * Caso de Uso: Abrir Cuenta
 * Abre una nueva cuenta bancaria (básica, infantil o ahorro futuro)
 */
export class AbrirCuentaUseCase {
  constructor(
    private clienteRepository: IClienteRepository,
    private cuentaRepository: ICuentaRepository,
    private transaccionRepository: ITransaccionRepository
  ) {}

  async execute(dto: AbrirCuentaDTO): Promise<Cuenta> {
    // Verificar que el cliente exista
    const cliente = await this.clienteRepository.buscarPorId(dto.clienteId);
    if (!cliente) {
      throw new Error('El cliente no existe');
    }

    // Validar monto inicial
    if (dto.montoInicial < 0) {
      throw new Error('El monto inicial no puede ser negativo');
    }

    // Crear la cuenta según el tipo
    const cuentaId = this.generarUUID();
    const numeroCuenta = this.generarNumeroCuenta();
    
    let cuenta: Cuenta;

    switch (dto.tipo) {
      case 'BASICA':
        cuenta = new Cuenta(
          cuentaId,
          numeroCuenta,
          dto.clienteId,
          TipoCuenta.AHORRO_BASICA,
          dto.montoInicial,
          EstadoCuenta.ACTIVA,
          new Date()
        );
        break;

      case 'INFANTIL':
        // Verificar que el menor exista
        const menor = await this.clienteRepository.buscarPorId(dto.menorId);
        if (!menor) {
          throw new Error('El cliente menor no existe');
        }
        
        cuenta = new Cuenta(
          cuentaId,
          numeroCuenta,
          dto.clienteId,
          TipoCuenta.AHORRO_INFANTIL,
          dto.montoInicial,
          EstadoCuenta.ACTIVA,
          new Date(),
          dto.menorId,
          dto.clienteId // El responsable es el cliente titular
        );
        break;

      case 'AHORRO_FUTURO':
        const fechaVencimiento = this.calcularFechaVencimiento(dto.plazoAhorro);
        
        cuenta = new Cuenta(
          cuentaId,
          numeroCuenta,
          dto.clienteId,
          TipoCuenta.AHORRO_FUTURO,
          dto.montoInicial,
          EstadoCuenta.ACTIVA,
          new Date(),
          undefined,
          undefined,
          dto.plazoAhorro,
          fechaVencimiento,
          dto.montoObjetivo
        );
        break;

      default:
        throw new Error('Tipo de cuenta no válido');
    }

    // Guardar la cuenta
    await this.cuentaRepository.guardar(cuenta);

    // Si hay monto inicial, registrar transacción de apertura
    if (dto.montoInicial > 0) {
      const transaccion = new Transaccion(
        this.generarUUID(),
        cuentaId,
        TipoTransaccion.APERTURA,
        dto.montoInicial,
        EstadoTransaccion.COMPLETADA,
        dto.agenteId,
        new Date(),
        this.generarNumeroRecibo(),
        `Apertura de cuenta ${numeroCuenta}`
      );
      await this.transaccionRepository.guardar(transaccion);
    }

    return cuenta;
  }

  private generarUUID(): UUID {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private generarNumeroCuenta(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${timestamp.slice(-6)}${random}`;
  }

  private generarNumeroRecibo(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `REC-${timestamp}-${random}`;
  }

  private calcularFechaVencimiento(plazo: PlazoAhorroFuturo): Date {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + plazo);
    return fecha;
  }
}

