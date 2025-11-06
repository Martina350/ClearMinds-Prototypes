// Utilidades para generar PDFs
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Payment, PaymentHistory, Deportista, Championship } from '../types';

// Generar HTML para reporte de pagos
const generatePaymentReportHTML = (
  payments: (Payment | PaymentHistory)[],
  deportista: Deportista,
  period: string
): string => {
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidPayments = payments.filter(p => p.status === 'paid');
  const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #E62026;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #E62026;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 16px;
            color: #666;
          }
          .student-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .student-info h2 {
            margin: 0 0 10px 0;
            color: #E62026;
          }
          .info-row {
            margin: 5px 0;
          }
          .label {
            font-weight: bold;
            color: #555;
          }
          .summary {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
          }
          .summary-card {
            text-align: center;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            flex: 1;
            margin: 0 10px;
          }
          .summary-value {
            font-size: 24px;
            font-weight: bold;
            color: #E62026;
          }
          .summary-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #E62026;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
          }
          .status-paid {
            background-color: #d4edda;
            color: #155724;
          }
          .status-pending {
            background-color: #fff3cd;
            color: #856404;
          }
          .status-overdue {
            background-color: #f8d7da;
            color: #721c24;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .amount {
            font-weight: bold;
            color: #E62026;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🏀 Escuela de Baloncesto San Pedro</div>
          <div class="subtitle">Reporte de Pagos</div>
        </div>

        <div class="student-info">
          <h2>${deportista.name}</h2>
          <div class="info-row">
            <span class="label">Categoría:</span> ${deportista.category}
          </div>
          <div class="info-row">
            <span class="label">Género:</span> ${deportista.gender}
          </div>
          <div class="info-row">
            <span class="label">Período:</span> ${period}
          </div>
          <div class="info-row">
            <span class="label">Fecha de generación:</span> ${new Date().toLocaleDateString('es-ES')}
          </div>
        </div>

        <div class="summary">
          <div class="summary-card">
            <div class="summary-value">${payments.length}</div>
            <div class="summary-label">Total Pagos</div>
          </div>
          <div class="summary-card">
            <div class="summary-value">${paidPayments.length}</div>
            <div class="summary-label">Pagados</div>
          </div>
          <div class="summary-card">
            <div class="summary-value">$${totalPaid.toFixed(2)}</div>
            <div class="summary-label">Total Pagado</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Método</th>
            </tr>
          </thead>
          <tbody>
            ${payments
              .map(
                payment => `
              <tr>
                <td>${payment.description}</td>
                <td class="amount">$${payment.amount.toFixed(2)}</td>
                <td>${new Date(payment.createdAt).toLocaleDateString('es-ES')}</td>
                <td>
                  <span class="status status-${payment.status}">
                    ${
                      payment.status === 'paid'
                        ? 'Pagado'
                        : payment.status === 'pending'
                        ? 'Pendiente'
                        : payment.status === 'overdue'
                        ? 'Vencido'
                        : 'En revisión'
                    }
                  </span>
                </td>
                <td>${
                  payment.paymentMethod === 'card'
                    ? 'Tarjeta'
                    : payment.paymentMethod === 'transfer'
                    ? 'Transferencia'
                    : 'N/A'
                }</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Este documento fue generado automáticamente por la aplicación móvil de la Escuela de Baloncesto San Pedro.</p>
          <p>Para consultas, contacte con la administración.</p>
        </div>
      </body>
    </html>
  `;
};

// Generar PDF de reporte de pagos
export const generatePaymentReportPDF = async (
  payments: (Payment | PaymentHistory)[],
  deportista: Deportista,
  period: string = 'Histórico'
): Promise<string | null> => {
  try {
    const html = generatePaymentReportHTML(payments, deportista, period);
    const { uri } = await Print.printToFileAsync({ html });
    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
};

// Compartir PDF
export const sharePDF = async (uri: string, filename: string = 'reporte_pagos.pdf') => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir reporte de pagos',
        UTI: 'com.adobe.pdf',
      });
      return true;
    } else {
      console.log('Sharing is not available on this device');
      return false;
    }
  } catch (error) {
    console.error('Error sharing PDF:', error);
    return false;
  }
};

// Generar HTML para comprobante de pago
const generatePaymentReceiptHTML = (payment: Payment, deportista: Deportista): string => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #24C36B;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #E62026;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 18px;
            color: #24C36B;
            font-weight: bold;
          }
          .receipt-number {
            text-align: center;
            font-size: 14px;
            color: #666;
            margin-bottom: 30px;
          }
          .info-section {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 10px 0;
            border-bottom: 1px solid #ddd;
          }
          .label {
            font-weight: bold;
            color: #555;
          }
          .value {
            color: #333;
          }
          .amount-section {
            background-color: #E62026;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          }
          .amount-label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 10px;
          }
          .amount-value {
            font-size: 36px;
            font-weight: bold;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 16px;
            background-color: #24C36B;
            color: white;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .stamp {
            text-align: center;
            margin: 30px 0;
            color: #E62026;
            font-weight: bold;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🏀 Escuela de Baloncesto San Pedro</div>
          <div class="subtitle">✓ COMPROBANTE DE PAGO</div>
        </div>

        <div class="receipt-number">
          Comprobante N°: ${payment.id.toUpperCase()}<br>
          Fecha de emisión: ${new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>

        <div class="info-section">
          <div class="info-row">
            <span class="label">Deportista:</span>
            <span class="value">${deportista.name}</span>
          </div>
          <div class="info-row">
            <span class="label">Categoría:</span>
            <span class="value">${deportista.category}</span>
          </div>
          <div class="info-row">
            <span class="label">Concepto:</span>
            <span class="value">${payment.description}</span>
          </div>
          <div class="info-row">
            <span class="label">Método de pago:</span>
            <span class="value">${
              payment.paymentMethod === 'card'
                ? 'Tarjeta de crédito/débito'
                : payment.paymentMethod === 'transfer'
                ? 'Transferencia bancaria'
                : 'No especificado'
            }</span>
          </div>
          <div class="info-row">
            <span class="label">Fecha de pago:</span>
            <span class="value">${
              payment.paymentDate
                ? new Date(payment.paymentDate).toLocaleDateString('es-ES')
                : 'No disponible'
            }</span>
          </div>
          <div class="info-row">
            <span class="label">Estado:</span>
            <span class="status-badge">PAGADO</span>
          </div>
        </div>

        <div class="amount-section">
          <div class="amount-label">Monto Total Pagado</div>
          <div class="amount-value">$${payment.amount.toFixed(2)}</div>
        </div>

        <div class="stamp">
          ✓ PAGO VERIFICADO Y CONFIRMADO
        </div>

        <div class="footer">
          <p><strong>Escuela de Baloncesto San Pedro</strong></p>
          <p>Este comprobante es válido como constancia de pago.</p>
          <p>Para consultas, contacte con la administración.</p>
          <p>Generado automáticamente el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString(
    'es-ES'
  )}</p>
        </div>
      </body>
    </html>
  `;
};

// Generar comprobante de pago en PDF
export const generatePaymentReceiptPDF = async (
  payment: Payment,
  deportista: Deportista
): Promise<string | null> => {
  try {
    const html = generatePaymentReceiptHTML(payment, deportista);
    const { uri } = await Print.printToFileAsync({ html });
    return uri;
  } catch (error) {
    console.error('Error generating payment receipt:', error);
    return null;
  }
};

// Generar estadísticas descargables en CSV
export const generateStatisticsCSV = async (
  payments: Payment[],
  deportista: Deportista
): Promise<string | null> => {
  try {
    const headers = 'Descripción,Monto,Fecha de Vencimiento,Estado,Método de Pago,Fecha de Pago\n';
    const rows = payments
      .map(
        p =>
          `"${p.description}",${p.amount},"${p.dueDate}","${p.status}","${p.paymentMethod || 'N/A'}","${
            p.paymentDate || 'N/A'
          }"`
      )
      .join('\n');

    const csv = headers + rows;
    const filename = `estadisticas_${deportista.name.replace(/\s/g, '_')}_${Date.now()}.csv`;
    const fileUri = FileSystem.documentDirectory + filename;

    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return fileUri;
  } catch (error) {
    console.error('Error generating CSV:', error);
    return null;
  }
};

