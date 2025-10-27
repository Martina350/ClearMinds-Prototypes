/**
 * Interfaz del servicio de impresión
 * La implementación concreta estará en la capa de infraestructura
 */
export interface DatosRecibo {
  numeroRecibo: string;
  fecha: Date;
  nombreCliente: string;
  numeroCuenta?: string;
  concepto: string;
  monto: number;
  nombreAgente: string;
  tipo: 'DEPOSITO' | 'COBRO' | 'APERTURA';
}

export interface IPrintService {
  /**
   * Imprime un recibo físico
   */
  imprimirRecibo(datos: DatosRecibo): Promise<void>;

  /**
   * Genera un recibo en formato PDF
   */
  generarReciboPDF(datos: DatosRecibo): Promise<string>; // Retorna la ruta del archivo

  /**
   * Envía un recibo por correo electrónico
   */
  enviarReciboPorEmail(datos: DatosRecibo, email: string): Promise<void>;

  /**
   * Verifica si hay una impresora conectada
   */
  verificarImpresoraConectada(): Promise<boolean>;

  /**
   * Verifica si debe simular falla de impresión para un cliente específico
   * Para pruebas de funcionalidad de reimpresión
   */
  simularFallaImpresion(nombreCliente: string): Promise<boolean>;
}

