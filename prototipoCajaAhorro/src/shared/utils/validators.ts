/**
 * Utilidades de validación
 */

/**
 * Valida un número de cédula ecuatoriana
 */
export const validarCedulaEcuatoriana = (cedula: string): boolean => {
  if (!cedula || cedula.length !== 10) {
    return false;
  }

  const digitos = cedula.split('').map(Number);
  const digitoRegion = digitos[0] * 10 + digitos[1];

  if (digitoRegion < 1 || (digitoRegion > 24 && digitoRegion !== 30)) {
    return false;
  }

  const digitoVerificador = digitos[9];
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  
  let suma = 0;
  for (let i = 0; i < 9; i++) {
    let valor = digitos[i] * coeficientes[i];
    if (valor > 9) {
      valor -= 9;
    }
    suma += valor;
  }

  const resultado = suma % 10 === 0 ? 0 : 10 - (suma % 10);
  return resultado === digitoVerificador;
};

/**
 * Valida un correo electrónico
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida un número de teléfono celular ecuatoriano
 */
export const validarCelular = (celular: string): boolean => {
  const regex = /^09\d{8}$/;
  return regex.test(celular);
};

/**
 * Valida que un monto sea positivo
 */
export const validarMontoPositivo = (monto: number): boolean => {
  return !isNaN(monto) && monto > 0;
};

