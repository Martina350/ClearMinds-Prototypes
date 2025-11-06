// Servicio para envío de emails
import * as MailComposer from 'expo-mail-composer';
import { Payment, PaymentHistory, Deportista } from '../types';

// Verificar disponibilidad de correo
export const isEmailAvailable = async (): Promise<boolean> => {
  try {
    return await MailComposer.isAvailableAsync();
  } catch (error) {
    console.error('Error checking email availability:', error);
    return false;
  }
};

// Enviar reporte de pagos por email
export const sendPaymentReportEmail = async (
  payments: (Payment | PaymentHistory)[],
  deportista: Deportista,
  pdfUri?: string
): Promise<boolean> => {
  try {
    const isAvailable = await isEmailAvailable();
    if (!isAvailable) {
      console.log('Email service not available');
      return false;
    }

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidPayments = payments.filter(p => p.status === 'paid');
    const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);

    const body = `
Reporte de Pagos - ${deportista.name}
================================

Categoría: ${deportista.category}
Género: ${deportista.gender}
Fecha de generación: ${new Date().toLocaleDateString('es-ES')}

Resumen:
- Total de pagos: ${payments.length}
- Pagos realizados: ${paidPayments.length}
- Total pagado: $${totalPaid.toFixed(2)}

Detalle de pagos:
${payments
  .map(
    (p, index) =>
      `${index + 1}. ${p.description}
   Monto: $${p.amount.toFixed(2)}
   Estado: ${
     p.status === 'paid'
       ? 'Pagado'
       : p.status === 'pending'
       ? 'Pendiente'
       : p.status === 'overdue'
       ? 'Vencido'
       : 'En revisión'
   }
   ${p.paymentDate ? `Fecha de pago: ${new Date(p.paymentDate).toLocaleDateString('es-ES')}` : ''}
`
  )
  .join('\n')}

---
Este reporte fue generado automáticamente por la aplicación móvil de la Escuela de Baloncesto San Pedro.
    `;

    const options: MailComposer.MailComposerOptions = {
      recipients: [],
      subject: `Reporte de Pagos - ${deportista.name}`,
      body: body,
    };

    if (pdfUri) {
      options.attachments = [pdfUri];
    }

    const result = await MailComposer.composeAsync(options);
    return result.status === 'sent';
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Enviar comprobante de pago por email
export const sendPaymentReceiptEmail = async (
  payment: Payment,
  deportista: Deportista,
  pdfUri?: string
): Promise<boolean> => {
  try {
    const isAvailable = await isEmailAvailable();
    if (!isAvailable) {
      console.log('Email service not available');
      return false;
    }

    const body = `
Comprobante de Pago
===================

Deportista: ${deportista.name}
Categoría: ${deportista.category}
Comprobante N°: ${payment.id.toUpperCase()}

Detalles del pago:
- Concepto: ${payment.description}
- Monto: $${payment.amount.toFixed(2)}
- Método de pago: ${
      payment.paymentMethod === 'card'
        ? 'Tarjeta de crédito/débito'
        : payment.paymentMethod === 'transfer'
        ? 'Transferencia bancaria'
        : 'No especificado'
    }
- Fecha de pago: ${payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('es-ES') : 'No disponible'}
- Estado: PAGADO ✓

---
Escuela de Baloncesto San Pedro
Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}
    `;

    const options: MailComposer.MailComposerOptions = {
      recipients: [],
      subject: `Comprobante de Pago - ${deportista.name} - ${payment.description}`,
      body: body,
    };

    if (pdfUri) {
      options.attachments = [pdfUri];
    }

    const result = await MailComposer.composeAsync(options);
    return result.status === 'sent';
  } catch (error) {
    console.error('Error sending receipt email:', error);
    return false;
  }
};

// Enviar recordatorio de pago
export const sendPaymentReminderEmail = async (
  payment: Payment,
  deportista: Deportista
): Promise<boolean> => {
  try {
    const isAvailable = await isEmailAvailable();
    if (!isAvailable) {
      console.log('Email service not available');
      return false;
    }

    const daysUntilDue = Math.ceil(
      (new Date(payment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    const body = `
Recordatorio de Pago
====================

Deportista: ${deportista.name}
Categoría: ${deportista.category}

Estimado padre/tutor,

Le recordamos que tiene un pago pendiente:

Concepto: ${payment.description}
Monto: $${payment.amount.toFixed(2)}
Fecha de vencimiento: ${new Date(payment.dueDate).toLocaleDateString('es-ES')}
${daysUntilDue > 0 ? `Días restantes: ${daysUntilDue}` : '⚠️ PAGO VENCIDO'}

Puede realizar el pago desde la aplicación móvil en la sección de Pagos.

---
Escuela de Baloncesto San Pedro
    `;

    const result = await MailComposer.composeAsync({
      recipients: [],
      subject: `Recordatorio de Pago - ${deportista.name}`,
      body: body,
    });

    return result.status === 'sent';
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return false;
  }
};

