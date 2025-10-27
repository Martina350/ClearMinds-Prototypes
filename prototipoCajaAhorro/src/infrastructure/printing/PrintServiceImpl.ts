import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { IPrintService, DatosRecibo } from '../../domain/services/IPrintService';

/**
 * Implementación del servicio de impresión usando Expo Print
 */
export class PrintServiceImpl implements IPrintService {
  async imprimirRecibo(datos: DatosRecibo): Promise<void> {
    try {
      // Verificar si hay impresora conectada
      const impresoraConectada = await this.verificarImpresoraConectada();
      if (!impresoraConectada) {
        throw new Error('PRINTER_NOT_CONNECTED');
      }

      const html = this.generarHTMLRecibo(datos);
      await Print.printAsync({ html });
    } catch (error: any) {
      console.error('Error al imprimir recibo:', error);
      if (error.message === 'PRINTER_NOT_CONNECTED') {
        throw error;
      }
      throw new Error('No se pudo imprimir el recibo');
    }
  }

  async generarReciboPDF(datos: DatosRecibo): Promise<string> {
    try {
      const html = this.generarHTMLRecibo(datos);
      const { uri } = await Print.printToFileAsync({ html });
      return uri;
    } catch (error) {
      console.error('Error al generar PDF:', error);
      throw new Error('No se pudo generar el PDF');
    }
  }

  async enviarReciboPorEmail(datos: DatosRecibo, email: string): Promise<void> {
    try {
      const pdfUri = await this.generarReciboPDF(datos);
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Enviar recibo por email',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.error('Error al compartir recibo:', error);
      throw new Error('No se pudo compartir el recibo');
    }
  }

  async verificarImpresoraConectada(): Promise<boolean> {
    try {
      // Simular verificación de impresora (para prototipo)
      // 20% de probabilidad de que no esté conectada para demostrar funcionalidad
      const estaConectada = Math.random() > 0.2;
      return estaConectada;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica si debe simular falla de impresión para un cliente específico
   * Para pruebas de funcionalidad de reimpresión
   */
  async simularFallaImpresion(nombreCliente: string): Promise<boolean> {
    // Simular falla de impresión específicamente para Carmen Rosa Jiménez
    // para poder probar la funcionalidad de reimpresión
    if (nombreCliente.includes('Carmen Rosa') || nombreCliente.includes('Jiménez')) {
      return true; // Siempre falla para este cliente
    }
    
    // Para otros clientes, comportamiento normal
    return false;
  }

  private generarHTMLRecibo(datos: DatosRecibo): string {
    const fechaFormateada = datos.fecha.toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 300px;
              margin: 20px auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 20px;
            }
            .header p {
              margin: 5px 0;
              font-size: 12px;
            }
            .content {
              margin: 20px 0;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin: 10px 0;
              font-size: 14px;
            }
            .row strong {
              font-weight: bold;
            }
            .total {
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
              padding: 10px 0;
              margin: 20px 0;
              font-size: 18px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RECAUDADORA MÓVIL</h1>
            <p>Recibo de ${datos.tipo}</p>
          </div>
          
          <div class="content">
            <div class="row">
              <span><strong>N° Recibo:</strong></span>
              <span>${datos.numeroRecibo}</span>
            </div>
            <div class="row">
              <span><strong>Fecha:</strong></span>
              <span>${fechaFormateada}</span>
            </div>
            <div class="row">
              <span><strong>Cliente:</strong></span>
              <span>${datos.nombreCliente}</span>
            </div>
            ${datos.numeroCuenta ? `
            <div class="row">
              <span><strong>N° Cuenta:</strong></span>
              <span>${datos.numeroCuenta}</span>
            </div>
            ` : ''}
            <div class="row">
              <span><strong>Concepto:</strong></span>
              <span>${datos.concepto}</span>
            </div>
            <div class="row">
              <span><strong>Agente:</strong></span>
              <span>${datos.nombreAgente}</span>
            </div>
          </div>
          
          <div class="total row">
            <span>TOTAL:</span>
            <span>$${datos.monto.toFixed(2)}</span>
          </div>
          
          <div class="footer">
            <p>¡Gracias por su preferencia!</p>
            <p>Este documento es un comprobante válido de su transacción</p>
          </div>
        </body>
      </html>
    `;
  }
}

