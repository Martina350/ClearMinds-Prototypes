/**
 * Base de Datos Mock para Prototipo
 * 
 * Esta es una base de datos simulada en memoria para demostración.
 * Contiene datos realistas de la Cooperativa de Ahorro y Crédito "Santa Teresita"
 * ubicada en Quito, Ecuador.
 * 
 * NOTA: En producción, esto se reemplazará por SQLite o conexión a backend.
 */

// ============================================================================
// TIPOS Y ENUMS
// ============================================================================

export enum TipoCuenta {
  BASICA = 'BASICA',
  INFANTIL = 'INFANTIL',
  AHORRO_FUTURO = 'AHORRO_FUTURO',
}

export enum EstadoCuenta {
  ACTIVA = 'ACTIVA',
  INACTIVA = 'INACTIVA',
  BLOQUEADA = 'BLOQUEADA',
}

export enum TipoTransaccion {
  DEPOSITO = 'DEPOSITO',
  RETIRO = 'RETIRO',
  COBRO = 'COBRO',
  APERTURA = 'APERTURA',
  INTERES = 'INTERES',
}

export enum EstadoTransaccion {
  COMPLETADA = 'COMPLETADA',
  PENDIENTE = 'PENDIENTE',
  CANCELADA = 'CANCELADA',
}

export enum EstadoPrestamo {
  ACTIVO = 'ACTIVO',
  PAGADO = 'PAGADO',
  VENCIDO = 'VENCIDO',
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface Cliente {
  id: string;
  cedula: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  celular: string;
  email?: string;
  direccion: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
  fechaRegistro: string;
  agente: string; // ID del agente que lo registró
  fotoCedula?: string;
  referencias?: ReferenciaPersonal[];
}

export interface ReferenciaPersonal {
  id: string;
  clienteId: string;
  nombre: string;
  telefono: string;
  parentesco: string;
}

export interface Cuenta {
  id: string;
  numeroCuenta: string;
  clienteId: string;
  tipo: TipoCuenta;
  saldo: number;
  saldoDisponible: number;
  estado: EstadoCuenta;
  fechaApertura: string;
  montoInicial: number;
  // Para cuentas infantiles
  titularMenor?: {
    cedula: string;
    nombre: string;
    apellidos: string;
    fechaNacimiento: string;
  };
  responsableId?: string; // ID del cliente responsable (para infantiles)
  relacion?: string; // Relación del responsable con el menor
  // Para cuentas de ahorro futuro
  plazo?: number; // 30, 60 o 90 días
  fechaVencimiento?: string;
  tasaInteres?: number;
  tipoPago?: 'MENSUALIZADO' | 'AL_VENCIMIENTO';
  cuentaMadreId?: string; // ID de la cuenta básica asociada
}

export interface Transaccion {
  id: string;
  numero: string;
  cuentaId: string;
  clienteId: string;
  tipo: TipoTransaccion;
  monto: number;
  saldoAnterior: number;
  saldoNuevo: number;
  estado: EstadoTransaccion;
  fecha: string;
  hora: string;
  concepto: string;
  agenteId: string;
  recibo?: string;
  notas?: string;
  coordenadas?: {
    latitud: number;
    longitud: number;
  };
}

export interface Prestamo {
  id: string;
  numero: string;
  clienteId: string;
  montoTotal: number;
  saldoPendiente: number;
  tasaInteres: number;
  plazoMeses: number;
  cuotaMensual: number;
  fechaInicio: string;
  fechaVencimiento: string;
  estado: EstadoPrestamo;
  cuotasPagadas: number;
  cuotasTotales: number;
  diasMora: number;
  montoMora: number;
  agenteId: string;
}

export interface Cobranza {
  id: string;
  prestamoId: string;
  clienteId: string;
  numeroCuota: number;
  montoCuota: number;
  montoInteres: number;
  montoCapital: number;
  montoMora: number;
  totalAPagar: number;
  fechaVencimiento: string;
  fechaPago?: string;
  pagado: boolean;
  diasMora: number;
}

export interface Agente {
  id: string;
  cedula: string;
  nombre: string;
  apellidos: string;
  email: string;
  celular: string;
  usuario: string;
  password: string; // En producción esto debe estar encriptado
  fechaIngreso: string;
  activo: boolean;
  zona?: string;
}

export interface Recibo {
  id: string;
  numero: string;
  transaccionId: string;
  clienteId: string;
  tipo: string;
  monto: number;
  fecha: string;
  hora: string;
  estado: 'IMPRESO' | 'ENVIADO';
  agenteId: string;
}

// ============================================================================
// DATOS MOCK
// ============================================================================

class MockDatabase {
  // Agentes (Usuarios del sistema)
  agentes: Agente[] = [
    {
      id: 'AG001',
      cedula: '1715234567',
      nombre: 'Carlos',
      apellidos: 'Mendoza López',
      email: 'carlos.mendoza@santateresita.ec',
      celular: '+593 098765432',
      usuario: 'cmendoza',
      password: '123456', // En producción: bcrypt hash
      fechaIngreso: '2023-01-15',
      activo: true,
      zona: 'Norte de Quito',
    },
    {
      id: 'AG002',
      cedula: '1705678901',
      nombre: 'María',
      apellidos: 'Rodríguez Castro',
      email: 'maria.rodriguez@santateresita.ec',
      celular: '+593 097654321',
      usuario: 'mrodriguez',
      password: '123456',
      fechaIngreso: '2023-03-20',
      activo: true,
      zona: 'Sur de Quito',
    },
  ];

  // Clientes
  clientes: Cliente[] = [
    {
      id: 'CLI001',
      cedula: '1714567890',
      nombre: 'Juan Carlos',
      apellidos: 'Pérez González',
      fechaNacimiento: '1985-06-15',
      celular: '+593 097654322',
      email: 'juan.perez@email.com',
      direccion: 'Av. Amazonas N24-123 y Coruña, La Mariscal, Quito',
      coordenadas: {
        latitud: -0.1807,
        longitud: -78.4884,
      },
      fechaRegistro: '2024-01-10 09:30:00',
      agente: 'AG001',
    },
    {
      id: 'CLI002',
      cedula: '1705432198',
      nombre: 'María Elena',
      apellidos: 'Gómez Rodríguez',
      fechaNacimiento: '1990-03-22',
      celular: '+593 092345678',
      email: 'maria.gomez@email.com',
      direccion: 'Calle Juan León Mera N23-45, La Floresta, Quito',
      coordenadas: {
        latitud: -0.1820,
        longitud: -78.4860,
      },
      fechaRegistro: '2024-01-12 14:15:00',
      agente: 'AG002',
    },
    {
      id: 'CLI003',
      cedula: '1723456789',
      nombre: 'Roberto',
      apellidos: 'Martínez Silva',
      fechaNacimiento: '1978-11-08',
      celular: '+593 098877665',
      email: 'roberto.martinez@email.com',
      direccion: 'Av. 6 de Diciembre N34-456, La Carolina, Quito',
      coordenadas: {
        latitud: -0.1750,
        longitud: -78.4850,
      },
      fechaRegistro: '2024-01-15 10:20:00',
      agente: 'AG001',
    },
    {
      id: 'CLI004',
      cedula: '1708765432',
      nombre: 'Ana Patricia',
      apellidos: 'López Vargas',
      fechaNacimiento: '1992-07-30',
      celular: '+593 096543210',
      email: 'ana.lopez@email.com',
      direccion: 'Av. 10 de Agosto S12-234, San Juan, Quito',
      coordenadas: {
        latitud: -0.1700,
        longitud: -78.4800,
      },
      fechaRegistro: '2024-01-18 11:45:00',
      agente: 'AG002',
    },
    {
      id: 'CLI005',
      cedula: '1719876543',
      nombre: 'Luis Fernando',
      apellidos: 'Castro Morales',
      fechaNacimiento: '1988-02-14',
      celular: '+593 095432109',
      email: 'luis.castro@email.com',
      direccion: 'Calle Wilson E4-567, Quito Norte',
      coordenadas: {
        latitud: -0.1840,
        longitud: -78.4880,
      },
      fechaRegistro: '2024-01-20 15:30:00',
      agente: 'AG001',
    },
    {
      id: 'CLI006',
      cedula: '1704321987',
      nombre: 'Carmen Rosa',
      apellidos: 'Jiménez Páez',
      fechaNacimiento: '1995-09-25',
      celular: '+593 094321098',
      email: 'carmen.jimenez@email.com',
      direccion: 'Av. Colón E6-789, Centro, Quito',
      coordenadas: {
        latitud: -0.1850,
        longitud: -78.4900,
      },
      fechaRegistro: '2024-01-22 09:00:00',
      agente: 'AG002',
    },
  ];

  // Referencias Personales
  referencias: ReferenciaPersonal[] = [
    {
      id: 'REF001',
      clienteId: 'CLI001',
      nombre: 'Pedro Pérez',
      telefono: '+593 099888777',
      parentesco: 'Hermano',
    },
    {
      id: 'REF002',
      clienteId: 'CLI001',
      nombre: 'Rosa González',
      telefono: '+593 098777666',
      parentesco: 'Madre',
    },
    {
      id: 'REF003',
      clienteId: 'CLI002',
      nombre: 'Jorge Gómez',
      telefono: '+593 097666555',
      parentesco: 'Padre',
    },
    {
      id: 'REF004',
      clienteId: 'CLI002',
      nombre: 'Lucía Rodríguez',
      telefono: '+593 096555444',
      parentesco: 'Hermana',
    },
  ];

  // Cuentas
  cuentas: Cuenta[] = [
    // Cuenta Básica - Juan Carlos Pérez
    {
      id: 'CTA001',
      numeroCuenta: 'AH-001-2024',
      clienteId: 'CLI001',
      tipo: TipoCuenta.BASICA,
      saldo: 1850.50,
      saldoDisponible: 1850.50,
      estado: EstadoCuenta.ACTIVA,
      fechaApertura: '2024-01-10',
      montoInicial: 100.00,
    },
    // Cuenta Básica - María Elena Gómez
    {
      id: 'CTA002',
      numeroCuenta: 'AH-002-2024',
      clienteId: 'CLI002',
      tipo: TipoCuenta.BASICA,
      saldo: 2275.75,
      saldoDisponible: 2275.75,
      estado: EstadoCuenta.ACTIVA,
      fechaApertura: '2024-01-12',
      montoInicial: 150.00,
    },
    // Cuenta Básica - Roberto Martínez
    {
      id: 'CTA003',
      numeroCuenta: 'AH-003-2024',
      clienteId: 'CLI003',
      tipo: TipoCuenta.BASICA,
      saldo: 3420.00,
      saldoDisponible: 3420.00,
      estado: EstadoCuenta.ACTIVA,
      fechaApertura: '2024-01-15',
      montoInicial: 200.00,
    },
    // Cuenta Infantil - Hijo de Ana López
    {
      id: 'CTA004',
      numeroCuenta: 'AI-001-2024',
      clienteId: 'CLI004',
      tipo: TipoCuenta.INFANTIL,
      saldo: 589.25,
      saldoDisponible: 589.25,
      estado: EstadoCuenta.ACTIVA,
      fechaApertura: '2024-01-18',
      montoInicial: 50.00,
      titularMenor: {
        cedula: '1798765432',
        nombre: 'Sebastián',
        apellidos: 'López Torres',
        fechaNacimiento: '2015-05-10',
      },
      responsableId: 'CLI004',
      relacion: 'Madre',
    },
    // Cuenta Ahorro Futuro - Juan Carlos Pérez
    {
      id: 'CTA005',
      numeroCuenta: 'AF-001-2024',
      clienteId: 'CLI001',
      tipo: TipoCuenta.AHORRO_FUTURO,
      saldo: 1000.00,
      saldoDisponible: 0, // Bloqueado hasta vencimiento
      estado: EstadoCuenta.ACTIVA,
      fechaApertura: '2024-01-10',
      montoInicial: 1000.00,
      plazo: 90,
      fechaVencimiento: '2024-04-10',
      tasaInteres: 1.48,
      tipoPago: 'AL_VENCIMIENTO',
      cuentaMadreId: 'CTA001',
    },
    // Cuenta Básica - Luis Castro
    {
      id: 'CTA006',
      numeroCuenta: 'AH-004-2024',
      clienteId: 'CLI005',
      tipo: TipoCuenta.BASICA,
      saldo: 4125.30,
      saldoDisponible: 4125.30,
      estado: EstadoCuenta.ACTIVA,
      fechaApertura: '2024-01-20',
      montoInicial: 300.00,
    },
    // Cuenta Básica - Carmen Jiménez
    {
      id: 'CTA007',
      numeroCuenta: 'AH-005-2024',
      clienteId: 'CLI006',
      tipo: TipoCuenta.BASICA,
      saldo: 1125.30,
      saldoDisponible: 1125.30,
      estado: EstadoCuenta.ACTIVA,
      fechaApertura: '2024-01-22',
      montoInicial: 75.00,
    },
  ];

  // Préstamos
  prestamos: Prestamo[] = [
    {
      id: 'PRE001',
      numero: 'P-2024-001',
      clienteId: 'CLI001',
      montoTotal: 5000.00,
      saldoPendiente: 3500.00,
      tasaInteres: 12.5,
      plazoMeses: 12,
      cuotaMensual: 450.00,
      fechaInicio: '2024-01-10',
      fechaVencimiento: '2025-01-10',
      estado: EstadoPrestamo.ACTIVO,
      cuotasPagadas: 3,
      cuotasTotales: 12,
      diasMora: 5,
      montoMora: 22.50,
      agenteId: 'AG001',
    },
    {
      id: 'PRE002',
      numero: 'P-2024-002',
      clienteId: 'CLI003',
      montoTotal: 8000.00,
      saldoPendiente: 6000.00,
      tasaInteres: 11.0,
      plazoMeses: 18,
      cuotaMensual: 480.00,
      fechaInicio: '2024-01-15',
      fechaVencimiento: '2025-07-15',
      estado: EstadoPrestamo.ACTIVO,
      cuotasPagadas: 2,
      cuotasTotales: 18,
      diasMora: 0,
      montoMora: 0,
      agenteId: 'AG001',
    },
  ];

  // Cobranzas (Cuotas de préstamos)
  cobranzas: Cobranza[] = [
    // Préstamo 1 - Cuota vencida
    {
      id: 'COB001',
      prestamoId: 'PRE001',
      clienteId: 'CLI001',
      numeroCuota: 4,
      montoCuota: 450.00,
      montoInteres: 50.00,
      montoCapital: 400.00,
      montoMora: 22.50,
      totalAPagar: 472.50,
      fechaVencimiento: '2024-05-10',
      pagado: false,
      diasMora: 5,
    },
    // Préstamo 1 - Próxima cuota
    {
      id: 'COB002',
      prestamoId: 'PRE001',
      clienteId: 'CLI001',
      numeroCuota: 5,
      montoCuota: 450.00,
      montoInteres: 48.00,
      montoCapital: 402.00,
      montoMora: 0,
      totalAPagar: 450.00,
      fechaVencimiento: '2024-06-10',
      pagado: false,
      diasMora: 0,
    },
    // Préstamo 2 - Cuota al día
    {
      id: 'COB003',
      prestamoId: 'PRE002',
      clienteId: 'CLI003',
      numeroCuota: 3,
      montoCuota: 480.00,
      montoInteres: 70.00,
      montoCapital: 410.00,
      montoMora: 0,
      totalAPagar: 480.00,
      fechaVencimiento: '2024-04-15',
      pagado: false,
      diasMora: 0,
    },
  ];

  // Transacciones
  transacciones: Transaccion[] = [
    // Aperturas
    {
      id: 'TRX001',
      numero: 'R-2024-001',
      cuentaId: 'CTA001',
      clienteId: 'CLI001',
      tipo: TipoTransaccion.APERTURA,
      monto: 100.00,
      saldoAnterior: 0,
      saldoNuevo: 100.00,
      estado: EstadoTransaccion.COMPLETADA,
      fecha: '2024-01-10',
      hora: '09:30:15',
      concepto: 'Apertura de cuenta de ahorro básica',
      agenteId: 'AG001',
      recibo: 'R-2024-001',
      coordenadas: {
        latitud: -0.1807,
        longitud: -78.4884,
      },
    },
    {
      id: 'TRX002',
      numero: 'R-2024-002',
      cuentaId: 'CTA002',
      clienteId: 'CLI002',
      tipo: TipoTransaccion.APERTURA,
      monto: 150.00,
      saldoAnterior: 0,
      saldoNuevo: 150.00,
      estado: EstadoTransaccion.COMPLETADA,
      fecha: '2024-01-12',
      hora: '14:15:30',
      concepto: 'Apertura de cuenta de ahorro básica',
      agenteId: 'AG002',
      recibo: 'R-2024-002',
    },
    // Depósitos
    {
      id: 'TRX003',
      numero: 'R-2024-003',
      cuentaId: 'CTA001',
      clienteId: 'CLI001',
      tipo: TipoTransaccion.DEPOSITO,
      monto: 500.00,
      saldoAnterior: 100.00,
      saldoNuevo: 600.00,
      estado: EstadoTransaccion.COMPLETADA,
      fecha: '2024-01-15',
      hora: '10:20:45',
      concepto: 'Depósito en efectivo',
      agenteId: 'AG001',
      recibo: 'R-2024-003',
    },
    {
      id: 'TRX004',
      numero: 'R-2024-004',
      cuentaId: 'CTA001',
      clienteId: 'CLI001',
      tipo: TipoTransaccion.DEPOSITO,
      monto: 750.50,
      saldoAnterior: 600.00,
      saldoNuevo: 1350.50,
      estado: EstadoTransaccion.COMPLETADA,
      fecha: '2024-01-20',
      hora: '11:45:20',
      concepto: 'Depósito ahorro mensual',
      agenteId: 'AG001',
      recibo: 'R-2024-004',
    },
    {
      id: 'TRX005',
      numero: 'R-2024-005',
      cuentaId: 'CTA002',
      clienteId: 'CLI002',
      tipo: TipoTransaccion.DEPOSITO,
      monto: 800.00,
      saldoAnterior: 150.00,
      saldoNuevo: 950.00,
      estado: EstadoTransaccion.COMPLETADA,
      fecha: '2024-01-18',
      hora: '15:30:10',
      concepto: 'Depósito en efectivo',
      agenteId: 'AG002',
      recibo: 'R-2024-005',
    },
    // Cobros
    {
      id: 'TRX006',
      numero: 'R-2024-006',
      cuentaId: 'CTA001',
      clienteId: 'CLI001',
      tipo: TipoTransaccion.COBRO,
      monto: 450.00,
      saldoAnterior: 1350.50,
      saldoNuevo: 900.50,
      estado: EstadoTransaccion.COMPLETADA,
      fecha: '2024-02-10',
      hora: '10:15:30',
      concepto: 'Pago cuota 1 - Préstamo P-2024-001',
      agenteId: 'AG001',
      recibo: 'R-2024-006',
    },
    {
      id: 'TRX007',
      numero: 'R-2024-007',
      cuentaId: 'CTA001',
      clienteId: 'CLI001',
      tipo: TipoTransaccion.COBRO,
      monto: 450.00,
      saldoAnterior: 900.50,
      saldoNuevo: 450.50,
      estado: EstadoTransaccion.COMPLETADA,
      fecha: '2024-03-10',
      hora: '14:20:15',
      concepto: 'Pago cuota 2 - Préstamo P-2024-001',
      agenteId: 'AG001',
      recibo: 'R-2024-007',
    },
    {
      id: 'TRX008',
      numero: 'R-2024-008',
      cuentaId: 'CTA001',
      clienteId: 'CLI001',
      tipo: TipoTransaccion.DEPOSITO,
      monto: 1400.00,
      saldoAnterior: 450.50,
      saldoNuevo: 1850.50,
      estado: EstadoTransaccion.COMPLETADA,
      fecha: '2024-04-05',
      hora: '09:10:25',
      concepto: 'Depósito grande - Ahorro',
      agenteId: 'AG001',
      recibo: 'R-2024-008',
    },
  ];

  // Recibos
  recibos: Recibo[] = [
    {
      id: 'REC001',
      numero: 'R-2024-001',
      transaccionId: 'TRX001',
      clienteId: 'CLI001',
      tipo: 'Apertura de Cuenta',
      monto: 100.00,
      fecha: '2024-01-10',
      hora: '09:30:15',
      estado: 'IMPRESO',
      agenteId: 'AG001',
    },
    {
      id: 'REC002',
      numero: 'R-2024-002',
      transaccionId: 'TRX002',
      clienteId: 'CLI002',
      tipo: 'Apertura de Cuenta',
      monto: 150.00,
      fecha: '2024-01-12',
      hora: '14:15:30',
      estado: 'IMPRESO',
      agenteId: 'AG002',
    },
    {
      id: 'REC003',
      numero: 'R-2024-003',
      transaccionId: 'TRX003',
      clienteId: 'CLI001',
      tipo: 'Depósito',
      monto: 500.00,
      fecha: '2024-01-15',
      hora: '10:20:45',
      estado: 'IMPRESO',
      agenteId: 'AG001',
    },
    {
      id: 'REC004',
      numero: 'R-2024-004',
      transaccionId: 'TRX004',
      clienteId: 'CLI001',
      tipo: 'Depósito',
      monto: 750.50,
      fecha: '2024-01-20',
      hora: '11:45:20',
      estado: 'ENVIADO',
      agenteId: 'AG001',
    },
    {
      id: 'REC005',
      numero: 'R-2024-005',
      transaccionId: 'TRX005',
      clienteId: 'CLI002',
      tipo: 'Depósito',
      monto: 800.00,
      fecha: '2024-01-18',
      hora: '15:30:10',
      estado: 'IMPRESO',
      agenteId: 'AG002',
    },
    {
      id: 'REC006',
      numero: 'R-2024-006',
      transaccionId: 'TRX006',
      clienteId: 'CLI001',
      tipo: 'Cobro',
      monto: 450.00,
      fecha: '2024-02-10',
      hora: '10:15:30',
      estado: 'IMPRESO',
      agenteId: 'AG001',
    },
    {
      id: 'REC007',
      numero: 'R-2024-007',
      transaccionId: 'TRX007',
      clienteId: 'CLI001',
      tipo: 'Cobro',
      monto: 450.00,
      fecha: '2024-03-10',
      hora: '14:20:15',
      estado: 'IMPRESO',
      agenteId: 'AG001',
    },
  ];

  // ============================================================================
  // MÉTODOS DE CONSULTA
  // ============================================================================

  // ----------- CLIENTES -----------
  getClientes(): Cliente[] {
    return this.clientes;
  }

  getClienteById(id: string): Cliente | undefined {
    return this.clientes.find(c => c.id === id);
  }

  getClienteByCedula(cedula: string): Cliente | undefined {
    return this.clientes.find(c => c.cedula === cedula);
  }

  buscarClientes(termino: string): Cliente[] {
    const terminoLower = termino.toLowerCase();
    return this.clientes.filter(c =>
      c.cedula.includes(termino) ||
      c.nombre.toLowerCase().includes(terminoLower) ||
      c.apellidos.toLowerCase().includes(terminoLower) ||
      `${c.nombre} ${c.apellidos}`.toLowerCase().includes(terminoLower)
    );
  }

  agregarCliente(cliente: Cliente): void {
    this.clientes.push(cliente);
  }

  // ----------- CUENTAS -----------
  getCuentas(): Cuenta[] {
    return this.cuentas;
  }

  getCuentaById(id: string): Cuenta | undefined {
    return this.cuentas.find(c => c.id === id);
  }

  getCuentaByNumero(numero: string): Cuenta | undefined {
    return this.cuentas.find(c => c.numeroCuenta === numero);
  }

  getCuentasByCliente(clienteId: string): Cuenta[] {
    return this.cuentas.filter(c => c.clienteId === clienteId);
  }

  getCuentasBasicas(): Cuenta[] {
    return this.cuentas.filter(c => c.tipo === TipoCuenta.BASICA);
  }

  // ----------- TRANSACCIONES -----------
  getTransacciones(): Transaccion[] {
    return this.transacciones;
  }

  getTransaccionesByCuenta(cuentaId: string): Transaccion[] {
    return this.transacciones.filter(t => t.cuentaId === cuentaId);
  }

  getTransaccionesByCliente(clienteId: string): Transaccion[] {
    return this.transacciones.filter(t => t.clienteId === clienteId);
  }

  getTransaccionesByFecha(fecha: string): Transaccion[] {
    return this.transacciones.filter(t => t.fecha === fecha);
  }

  getTransaccionesByAgente(agenteId: string): Transaccion[] {
    return this.transacciones.filter(t => t.agenteId === agenteId);
  }

  agregarTransaccion(transaccion: Transaccion): void {
    this.transacciones.push(transaccion);
    // Actualizar saldo de la cuenta
    const cuenta = this.getCuentaById(transaccion.cuentaId);
    if (cuenta) {
      cuenta.saldo = transaccion.saldoNuevo;
      cuenta.saldoDisponible = transaccion.saldoNuevo;
    }
  }

  // ----------- PRÉSTAMOS -----------
  getPrestamos(): Prestamo[] {
    return this.prestamos;
  }

  getPrestamosByCliente(clienteId: string): Prestamo[] {
    return this.prestamos.filter(p => p.clienteId === clienteId);
  }

  getPrestamosActivos(): Prestamo[] {
    return this.prestamos.filter(p => p.estado === EstadoPrestamo.ACTIVO);
  }

  // ----------- COBRANZAS -----------
  getCobranzas(): Cobranza[] {
    return this.cobranzas;
  }

  getCobranzasByCliente(clienteId: string): Cobranza[] {
    return this.cobranzas.filter(c => c.clienteId === clienteId);
  }

  getCobranzasPendientes(): Cobranza[] {
    return this.cobranzas.filter(c => !c.pagado);
  }

  getCobranzasConMora(): Cobranza[] {
    return this.cobranzas.filter(c => !c.pagado && c.diasMora > 0);
  }

  // ----------- RECIBOS -----------
  getRecibos(): Recibo[] {
    return this.recibos;
  }

  getRecibosByCliente(clienteId: string): Recibo[] {
    return this.recibos.filter(r => r.clienteId === clienteId);
  }

  agregarRecibo(recibo: Recibo): void {
    this.recibos.push(recibo);
  }

  // ----------- AGENTES -----------
  getAgentes(): Agente[] {
    return this.agentes;
  }

  getAgenteById(id: string): Agente | undefined {
    return this.agentes.find(a => a.id === id);
  }

  autenticarAgente(usuario: string, password: string): Agente | null {
    const agente = this.agentes.find(a => a.usuario === usuario && a.password === password && a.activo);
    return agente || null;
  }

  // ----------- DASHBOARD -----------
  getDashboardData(fecha: string, agenteId?: string) {
    // Filtrar transacciones del día
    let transaccionesDia = this.getTransaccionesByFecha(fecha);
    if (agenteId) {
      transaccionesDia = transaccionesDia.filter(t => t.agenteId === agenteId);
    }

    // Calcular métricas
    const aperturas = transaccionesDia.filter(t => t.tipo === TipoTransaccion.APERTURA);
    const depositos = transaccionesDia.filter(t => t.tipo === TipoTransaccion.DEPOSITO);
    const cobros = transaccionesDia.filter(t => t.tipo === TipoTransaccion.COBRO);

    const totalDepositos = depositos.reduce((sum, t) => sum + t.monto, 0);
    const totalCobros = cobros.reduce((sum, t) => sum + t.monto, 0);
    const totalRecaudado = totalDepositos + totalCobros + aperturas.reduce((sum, t) => sum + t.monto, 0);

    return {
      fecha,
      cuentasAperturadas: aperturas.length,
      totalDepositos: {
        cantidad: depositos.length,
        monto: totalDepositos,
      },
      totalCobros: {
        cantidad: cobros.length,
        monto: totalCobros,
      },
      montoTotalRecaudado: totalRecaudado,
      transacciones: transaccionesDia,
    };
  }

  // ----------- UTILIDADES -----------
  generarNumeroCuenta(tipo: TipoCuenta): string {
    const prefijo = tipo === TipoCuenta.BASICA ? 'AH' : tipo === TipoCuenta.INFANTIL ? 'AI' : 'AF';
    const año = new Date().getFullYear();
    const numero = this.cuentas.filter(c => c.numeroCuenta.startsWith(prefijo)).length + 1;
    return `${prefijo}-${String(numero).padStart(3, '0')}-${año}`;
  }

  generarNumeroTransaccion(): string {
    const año = new Date().getFullYear();
    const numero = this.transacciones.length + 1;
    return `R-${año}-${String(numero).padStart(3, '0')}`;
  }

  generarNumeroRecibo(): string {
    return this.generarNumeroTransaccion();
  }
}

// Exportar instancia singleton
export const mockDB = new MockDatabase();

// Exportar clase para testing
export default MockDatabase;


