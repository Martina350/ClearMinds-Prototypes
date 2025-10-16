// Tipos compartidos en toda la aplicación

export type UUID = string;

export enum TipoCuenta {
  AHORRO_BASICA = 'AHORRO_BASICA',
  AHORRO_INFANTIL = 'AHORRO_INFANTIL',
  AHORRO_FUTURO = 'AHORRO_FUTURO',
}

export enum TipoTransaccion {
  DEPOSITO = 'DEPOSITO',
  COBRO = 'COBRO',
  APERTURA = 'APERTURA',
}

export enum EstadoCuenta {
  ACTIVA = 'ACTIVA',
  INACTIVA = 'INACTIVA',
  BLOQUEADA = 'BLOQUEADA',
}

export enum PlazoAhorroFuturo {
  TREINTA_DIAS = 30,
  SESENTA_DIAS = 60,
  NOVENTA_DIAS = 90,
}

export enum EstadoTransaccion {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  SINCRONIZADA = 'SINCRONIZADA',
}

