import { ISyncService } from '../../domain/services/ISyncService';
import { Transaccion } from '../../domain/entities/Transaccion';
import { Cliente } from '../../domain/entities/Cliente';
import { Cuenta } from '../../domain/entities/Cuenta';
import { Cobranza } from '../../domain/entities/Cobranza';
import { UUID } from '../../shared/types';

/**
 * Implementación del servicio de sincronización
 */
export class SyncServiceImpl implements ISyncService {
  private baseUrl: string;
  private apiKey: string;
  private isOnline: boolean = false;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  /**
   * Verifica la conexión a internet
   */
  async verificarConexion(): Promise<boolean> {
    try {
      // Simular verificación de conexión
      // En producción, haría una petición real al servidor
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 5000, // 5 segundos de timeout
      });
      
      this.isOnline = response.ok;
      return this.isOnline;
    } catch (error) {
      console.error('Error al verificar conexión:', error);
      this.isOnline = false;
      return false;
    }
  }

  /**
   * Sincroniza transacciones pendientes
   */
  async sincronizarTransacciones(transacciones: Transaccion[]): Promise<boolean> {
    try {
      if (!this.isOnline) {
        await this.verificarConexion();
        if (!this.isOnline) {
          throw new Error('Sin conexión a internet');
        }
      }

      const transaccionesPendientes = transacciones.filter(t => !t.estaSincronizada);
      
      if (transaccionesPendientes.length === 0) {
        return true;
      }

      const response = await fetch(`${this.baseUrl}/transacciones/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transacciones: transaccionesPendientes.map(t => this.mapearTransaccionParaSync(t))
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en sincronización: ${response.status}`);
      }

      const resultado = await response.json();
      console.log(`Sincronizadas ${resultado.sincronizadas} transacciones`);
      
      return true;
    } catch (error) {
      console.error('Error al sincronizar transacciones:', error);
      return false;
    }
  }

  /**
   * Sincroniza clientes
   */
  async sincronizarClientes(clientes: Cliente[]): Promise<boolean> {
    try {
      if (!this.isOnline) {
        await this.verificarConexion();
        if (!this.isOnline) {
          throw new Error('Sin conexión a internet');
        }
      }

      const response = await fetch(`${this.baseUrl}/clientes/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientes: clientes.map(c => this.mapearClienteParaSync(c))
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en sincronización de clientes: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error al sincronizar clientes:', error);
      return false;
    }
  }

  /**
   * Sincroniza cuentas
   */
  async sincronizarCuentas(cuentas: Cuenta[]): Promise<boolean> {
    try {
      if (!this.isOnline) {
        await this.verificarConexion();
        if (!this.isOnline) {
          throw new Error('Sin conexión a internet');
        }
      }

      const response = await fetch(`${this.baseUrl}/cuentas/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cuentas: cuentas.map(c => this.mapearCuentaParaSync(c))
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en sincronización de cuentas: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error al sincronizar cuentas:', error);
      return false;
    }
  }

  /**
   * Sincroniza cobranzas
   */
  async sincronizarCobranzas(cobranzas: Cobranza[]): Promise<boolean> {
    try {
      if (!this.isOnline) {
        await this.verificarConexion();
        if (!this.isOnline) {
          throw new Error('Sin conexión a internet');
        }
      }

      const response = await fetch(`${this.baseUrl}/cobranzas/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cobranzas: cobranzas.map(c => this.mapearCobranzaParaSync(c))
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en sincronización de cobranzas: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error al sincronizar cobranzas:', error);
      return false;
    }
  }

  /**
   * Sincronización completa
   */
  async sincronizarTodo(datos: {
    transacciones: Transaccion[];
    clientes: Cliente[];
    cuentas: Cuenta[];
    cobranzas: Cobranza[];
  }): Promise<{
    exitoso: boolean;
    detalles: {
      transacciones: boolean;
      clientes: boolean;
      cuentas: boolean;
      cobranzas: boolean;
    };
  }> {
    const resultados = {
      transacciones: false,
      clientes: false,
      cuentas: false,
      cobranzas: false,
    };

    try {
      // Sincronizar en paralelo
      const promesas = [
        this.sincronizarTransacciones(datos.transacciones).then(r => { resultados.transacciones = r; }),
        this.sincronizarClientes(datos.clientes).then(r => { resultados.clientes = r; }),
        this.sincronizarCuentas(datos.cuentas).then(r => { resultados.cuentas = r; }),
        this.sincronizarCobranzas(datos.cobranzas).then(r => { resultados.cobranzas = r; }),
      ];

      await Promise.allSettled(promesas);

      const exitoso = Object.values(resultados).every(r => r);

      return {
        exitoso,
        detalles: resultados,
      };
    } catch (error) {
      console.error('Error en sincronización completa:', error);
      return {
        exitoso: false,
        detalles: resultados,
      };
    }
  }

  /**
   * Obtiene datos del servidor
   */
  async obtenerDatosDelServidor(): Promise<{
    clientes: Cliente[];
    cuentas: Cuenta[];
    cobranzas: Cobranza[];
  }> {
    try {
      if (!this.isOnline) {
        await this.verificarConexion();
        if (!this.isOnline) {
          throw new Error('Sin conexión a internet');
        }
      }

      const [clientesResponse, cuentasResponse, cobranzasResponse] = await Promise.all([
        fetch(`${this.baseUrl}/clientes`, {
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        }),
        fetch(`${this.baseUrl}/cuentas`, {
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        }),
        fetch(`${this.baseUrl}/cobranzas`, {
          headers: { 'Authorization': `Bearer ${this.apiKey}` }
        }),
      ]);

      const [clientes, cuentas, cobranzas] = await Promise.all([
        clientesResponse.json(),
        cuentasResponse.json(),
        cobranzasResponse.json(),
      ]);

      return { clientes, cuentas, cobranzas };
    } catch (error) {
      console.error('Error al obtener datos del servidor:', error);
      throw error;
    }
  }

  // Métodos privados para mapear entidades

  private mapearTransaccionParaSync(transaccion: Transaccion) {
    return {
      id: transaccion.id,
      cuentaId: transaccion.cuentaId,
      tipo: transaccion.tipo,
      monto: transaccion.monto,
      estado: transaccion.estado,
      agenteId: transaccion.agenteId,
      fecha: transaccion.fecha.toISOString(),
      numeroRecibo: transaccion.numeroRecibo,
      descripcion: transaccion.descripcion,
      cobranzaId: transaccion.cobranzaId,
    };
  }

  private mapearClienteParaSync(cliente: Cliente) {
    return {
      id: cliente.id,
      cedula: cliente.cedula,
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      fechaNacimiento: cliente.fechaNacimiento.toISOString(),
      direccion: cliente.direccion,
      coordenadas: cliente.coordenadas,
      celular: cliente.celular,
      correo: cliente.correo,
    };
  }

  private mapearCuentaParaSync(cuenta: Cuenta) {
    return {
      id: cuenta.id,
      numeroCuenta: cuenta.numeroCuenta,
      clienteId: cuenta.clienteId,
      tipo: cuenta.tipo,
      saldo: cuenta.saldo,
      estado: cuenta.estado,
      fechaApertura: cuenta.fechaApertura.toISOString(),
      menorId: cuenta.menorId,
      responsableId: cuenta.responsableId,
      plazoAhorro: cuenta.plazoAhorro,
      fechaVencimiento: cuenta.fechaVencimiento?.toISOString(),
      montoObjetivo: cuenta.montoObjetivo,
    };
  }

  private mapearCobranzaParaSync(cobranza: Cobranza) {
    return {
      id: cobranza.id,
      clienteId: cobranza.clienteId,
      cuentaId: cobranza.cuentaId,
      prestamoId: cobranza.prestamoId,
      cuotaId: cobranza.cuotaId,
      montoPendiente: cobranza.montoPendiente,
      montoOriginal: cobranza.montoOriginal,
      montoMora: cobranza.montoMora,
      montoInteres: cobranza.montoInteres,
      fechaVencimiento: cobranza.fechaVencimiento.toISOString(),
      estado: cobranza.estado,
      tipo: cobranza.tipo,
      concepto: cobranza.concepto,
      numeroCuota: cobranza.numeroCuota,
      diasMora: cobranza.diasMora,
    };
  }
}
