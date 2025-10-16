/**
 * Utilidades de formateo
 */

/**
 * Formatea un número como moneda
 */
export const formatearMoneda = (monto: number): string => {
  return `$${monto.toFixed(2)}`;
};

/**
 * Formatea una fecha en formato local
 */
export const formatearFecha = (fecha: Date): string => {
  return fecha.toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formatea una fecha con hora
 */
export const formatearFechaHora = (fecha: Date): string => {
  return fecha.toLocaleString('es-EC', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formatea un número de cédula (con guiones)
 */
export const formatearCedula = (cedula: string): string => {
  if (cedula.length !== 10) return cedula;
  return `${cedula.slice(0, 3)}-${cedula.slice(3, 6)}-${cedula.slice(6)}`;
};

/**
 * Formatea un número de cuenta
 */
export const formatearNumeroCuenta = (numeroCuenta: string): string => {
  // Formato: XXXX-XXXX-XXXX
  if (numeroCuenta.length < 8) return numeroCuenta;
  const grupos = numeroCuenta.match(/.{1,4}/g) || [];
  return grupos.join('-');
};

