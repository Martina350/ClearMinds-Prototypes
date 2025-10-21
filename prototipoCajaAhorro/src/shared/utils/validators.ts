/**
 * Utilidades de validación para el sistema
 */

/**
 * Valida una cédula ecuatoriana
 */
export const validarCedulaEcuatoriana = (cedula: string): boolean => {
  if (!cedula || cedula.length !== 10) {
    return false;
  }

  // Verificar que solo contenga números
  if (!/^\d{10}$/.test(cedula)) {
    return false;
  }

  // Algoritmo de validación de cédula ecuatoriana
  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    const digito = parseInt(cedula[i]);
    const producto = digito * coeficientes[i];
    
    if (producto >= 10) {
      suma += Math.floor(producto / 10) + (producto % 10);
    } else {
      suma += producto;
    }
  }

  const residuo = suma % 10;
  const digitoVerificador = residuo === 0 ? 0 : 10 - residuo;
  
  return digitoVerificador === parseInt(cedula[9]);
};

/**
 * Valida un número de teléfono ecuatoriano
 */
export const validarTelefonoEcuatoriano = (telefono: string): boolean => {
  if (!telefono) return false;
  
  // Remover espacios y caracteres especiales
  const cleanPhone = telefono.replace(/[\s\-\(\)]/g, '');
  
  // Verificar formato ecuatoriano
  // +593 seguido de 9 dígitos (total 13 caracteres)
  if (/^\+593\d{9}$/.test(cleanPhone)) {
    return true;
  }
  
  // Verificar formato sin código de país (9 dígitos)
  if (/^09\d{8}$/.test(cleanPhone)) {
    return true;
  }
  
  return false;
};

/**
 * Valida un monto mínimo
 */
export const validarMontoMinimo = (monto: number, minimo: number = 1): boolean => {
  return monto >= minimo;
};

/**
 * Valida un monto máximo
 */
export const validarMontoMaximo = (monto: number, maximo: number): boolean => {
  return monto <= maximo;
};

/**
 * Valida la edad mínima
 */
export const validarEdadMinima = (fechaNacimiento: Date, edadMinima: number = 18): boolean => {
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    return (edad - 1) >= edadMinima;
  }
  
  return edad >= edadMinima;
};

/**
 * Valida la edad máxima
 */
export const validarEdadMaxima = (fechaNacimiento: Date, edadMaxima: number = 100): boolean => {
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    return (edad - 1) <= edadMaxima;
  }
  
  return edad <= edadMaxima;
};

/**
 * Valida un nombre (solo letras y espacios)
 */
export const validarNombre = (nombre: string): boolean => {
  if (!nombre || nombre.trim().length === 0) {
    return false;
  }
  
  // Solo letras, espacios y algunos caracteres especiales
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre.trim());
};

/**
 * Valida un email básico
 */
export const validarEmail = (email: string): boolean => {
  if (!email || email.trim().length === 0) {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida que un campo no esté vacío
 */
export const validarCampoRequerido = (valor: string): boolean => {
  return Boolean(valor && valor.trim().length > 0);
};

/**
 * Valida la longitud mínima de un texto
 */
export const validarLongitudMinima = (texto: string, longitudMinima: number): boolean => {
  return Boolean(texto && texto.trim().length >= longitudMinima);
};

/**
 * Valida la longitud máxima de un texto
 */
export const validarLongitudMaxima = (texto: string, longitudMaxima: number): boolean => {
  return !texto || texto.trim().length <= longitudMaxima;
};

/**
 * Valida un número de cuenta
 */
export const validarNumeroCuenta = (numeroCuenta: string): boolean => {
  if (!numeroCuenta || numeroCuenta.trim().length === 0) {
    return false;
  }
  
  // Formato: AH-XXX-YYYY (ejemplo: AH-001-2024)
  const cuentaRegex = /^AH-\d{3}-\d{4}$/;
  return cuentaRegex.test(numeroCuenta.trim());
};

/**
 * Valida una fecha de nacimiento para cuenta infantil
 */
export const validarFechaNacimientoInfantil = (fechaNacimiento: Date): boolean => {
  const hoy = new Date();
  const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  
  let edadCalculada = edad;
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edadCalculada = edad - 1;
  }
  
  // Para cuenta infantil, debe ser menor de 18 años
  return edadCalculada < 18 && edadCalculada >= 0;
};

/**
 * Valida un parentesco
 */
export const validarParentesco = (parentesco: string): boolean => {
  const parentescosValidos = [
    'PADRE', 'MADRE', 'HERMANO', 'HERMANA', 'ESPOSO', 'ESPOSA',
    'HIJO', 'HIJA', 'TIO', 'TIA', 'PRIMO', 'PRIMA',
    'AMIGO', 'AMIGA', 'VECINO', 'VECINA', 'OTRO'
  ];
  
  return parentescosValidos.includes(parentesco.toUpperCase());
};

/**
 * Valida un plazo de ahorro futuro
 */
export const validarPlazoAhorroFuturo = (plazo: number): boolean => {
  const plazosValidos = [30, 60, 90];
  return plazosValidos.includes(plazo);
};

/**
 * Valida un monto de depósito inicial
 */
export const validarMontoDepositoInicial = (monto: number): boolean => {
  return monto >= 1 && monto <= 1000; // Entre $1 y $1000
};

/**
 * Valida un número de recibo
 */
export const validarNumeroRecibo = (numeroRecibo: string): boolean => {
  if (!numeroRecibo || numeroRecibo.trim().length === 0) {
    return false;
  }
  
  // Formato: REC-YYYYMMDD-XXXX (ejemplo: REC-20240115-0001)
  const reciboRegex = /^REC-\d{8}-\d{4}$/;
  return reciboRegex.test(numeroRecibo.trim());
};

/**
 * Valida coordenadas GPS
 */
export const validarCoordenadas = (latitud: number, longitud: number): boolean => {
  // Ecuador está aproximadamente entre -5 y 1 de latitud, y -81 y -75 de longitud
  return latitud >= -5 && latitud <= 1 && longitud >= -81 && longitud <= -75;
};

/**
 * Valida un código de agente
 */
export const validarCodigoAgente = (codigo: string): boolean => {
  if (!codigo || codigo.trim().length === 0) {
    return false;
  }
  
  // Formato: AG-XXX (ejemplo: AG-001)
  const agenteRegex = /^AG-\d{3}$/;
  return agenteRegex.test(codigo.trim());
};