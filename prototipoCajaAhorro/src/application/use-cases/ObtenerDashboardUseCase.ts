import { ITransaccionRepository } from '../../domain/repositories/ITransaccionRepository';
import { ICuentaRepository } from '../../domain/repositories/ICuentaRepository';
import { TipoTransaccion, UUID } from '../../shared/types';

/**
 * DTO del resultado del dashboard
 */
export interface DashboardData {
  fecha: Date;
  // Métricas básicas
  cuentasAperturadas: number;
  cuentasBasicasAperturadas: number;
  cuentasInfantilesAperturadas: number;
  cuentasFuturoAperturadas: number;
  
  // Métricas de transacciones
  totalDepositos: {
    cantidad: number;
    monto: number;
  };
  totalCobros: {
    cantidad: number;
    monto: number;
  };
  
  // Métricas de clientes
  clientesNuevos: number;
  clientesRecurrentes: number;
  
  // Métricas financieras
  montoTotalRecaudado: number;
  promedioTransaccion: number;
  montoMayorTransaccion: number;
  montoMenorTransaccion: number;
  
  // Métricas de préstamos
  prestamosCobrados: number;
  montoPrestamosCobrados: number;
  cuotasVencidas: number;
  montoMoraRecaudado: number;
  
  // Métricas de rendimiento
  eficienciaCobranza: number; // Porcentaje de cobranza exitosa
  tiempoPromedioTransaccion: number; // En minutos
  
  // Historial detallado
  historial: Array<{
    tipo: TipoTransaccion;
    cantidad: number;
    monto: number;
  }>;
  
  // Métricas por hora
  transaccionesPorHora: Array<{
    hora: number;
    cantidad: number;
    monto: number;
  }>;
}

/**
 * Caso de Uso: Obtener Dashboard
 * Obtiene el resumen de actividades del día para un agente
 */
export class ObtenerDashboardUseCase {
  constructor(
    private transaccionRepository: ITransaccionRepository,
    private cuentaRepository: ICuentaRepository
  ) {}

  async execute(agenteId: UUID, fecha?: Date): Promise<DashboardData> {
    const fechaConsulta = fecha || new Date();
    const inicioDia = new Date(fechaConsulta);
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date(fechaConsulta);
    finDia.setHours(23, 59, 59, 999);

    // Obtener todas las transacciones del día para el agente
    const transaccionesDelDia = await this.transaccionRepository.obtenerPorFechas(
      inicioDia,
      finDia
    );

    // Filtrar por agente
    const transaccionesAgente = transaccionesDelDia.filter(
      (t) => t.agenteId === agenteId
    );

    // Contar cuentas aperturadas
    const aperturaCuentas = transaccionesAgente.filter(
      (t) => t.tipo === TipoTransaccion.APERTURA
    );
    const cuentasAperturadas = aperturaCuentas.length;

    // Calcular depósitos
    const depositos = transaccionesAgente.filter(
      (t) => t.tipo === TipoTransaccion.DEPOSITO
    );
    const totalDepositos = {
      cantidad: depositos.length,
      monto: depositos.reduce((sum, t) => sum + t.monto, 0),
    };

    // Calcular cobros
    const cobros = transaccionesAgente.filter(
      (t) => t.tipo === TipoTransaccion.COBRO
    );
    const totalCobros = {
      cantidad: cobros.length,
      monto: cobros.reduce((sum, t) => sum + t.monto, 0),
    };

    // Calcular monto total recaudado
    const montoTotalRecaudado = totalDepositos.monto + totalCobros.monto;

    // Generar historial consolidado
    const historial = [
      {
        tipo: TipoTransaccion.APERTURA,
        cantidad: cuentasAperturadas,
        monto: aperturaCuentas.reduce((sum, t) => sum + t.monto, 0),
      },
      {
        tipo: TipoTransaccion.DEPOSITO,
        cantidad: totalDepositos.cantidad,
        monto: totalDepositos.monto,
      },
      {
        tipo: TipoTransaccion.COBRO,
        cantidad: totalCobros.cantidad,
        monto: totalCobros.monto,
      },
    ];

    return {
      fecha: fechaConsulta,
      cuentasAperturadas,
      totalDepositos,
      totalCobros,
      montoTotalRecaudado,
      historial,
    };
  }
}

