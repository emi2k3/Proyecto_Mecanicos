// validations.js - Utilidades de validación para formularios uruguayos
/**
 * Valida formato de matrícula uruguaya
 * @param {string} text - Texto a validar
 * @returns {boolean} - True si es válida
 */
export const validateMatricula = text => {
  // Formato: ABC 1234 (3 letras, espacio, 4 números)
  const uruguayanPlateRegex = /^[A-Z]{3}\s[0-9]{4}$/;
  return uruguayanPlateRegex.test(text.toUpperCase());
};

/**
 * Valida CI uruguaya usando el algoritmo oficial
 * @param {string} ci - CI a validar
 * @returns {boolean} - True si es válida
 */
export const validateCI = ci => {
  // Remover puntos y guiones
  const cleanCI = ci.replace(/[.-]/g, '');

  // Debe tener entre 6 y 8 dígitos
  if (!/^\d{6,8}$/.test(cleanCI)) {
    return false;
  }

  // Algoritmo de validación oficial de CI uruguaya
  const digits = cleanCI.split('').map(Number);
  const weights = [2, 9, 8, 7, 6, 3, 4, 1];

  let sum = 0;
  for (let i = 0; i < digits.length - 1; i++) {
    sum += digits[i] * weights[i + (8 - digits.length)];
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[digits.length - 1];
};

/**
 * Valida RUT uruguayo
 * @param {string} rut - RUT a validar
 * @returns {boolean} - True si es válido
 */
export const validateRUT = rut => {
  // Formato básico: 12 dígitos
  const cleanRUT = rut.replace(/[.-]/g, '');

  if (!/^\d{12}$/.test(cleanRUT)) {
    return false;
  }

  // Algoritmo de validación de RUT
  const digits = cleanRUT.split('').map(Number);
  const weights = [4, 3, 6, 7, 8, 9, 2, 3, 4, 5, 6, 7];

  let sum = 0;
  for (let i = 0; i < 11; i++) {
    sum += digits[i] * weights[i];
  }

  const remainder = sum % 11;
  const checkDigit = remainder < 2 ? remainder : 11 - remainder;

  return checkDigit === digits[11];
};

/**
 * Formatea CI uruguaya (agregar puntos y guión)
 * @param {string} text - Texto a formatear
 * @returns {string} - CI formateada
 */
export const formatCI = text => {
  const cleaned = text.replace(/[^0-9]/g, '');

  if (cleaned.length <= 1) return cleaned;
  if (cleaned.length <= 4) return cleaned.slice(0, 1) + '.' + cleaned.slice(1);
  if (cleaned.length <= 7)
    return (
      cleaned.slice(0, 1) + '.' + cleaned.slice(1, 4) + '.' + cleaned.slice(4)
    );
  return (
    cleaned.slice(0, 1) +
    '.' +
    cleaned.slice(1, 4) +
    '.' +
    cleaned.slice(4, 7) +
    '-' +
    cleaned.slice(7, 8)
  );
};

/**
 * Formatea RUT uruguayo
 * @param {string} text - Texto a formatear
 * @returns {string} - RUT formateado
 */
export const formatRUT = text => {
  const cleaned = text.replace(/[^0-9]/g, '');

  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 5) return cleaned.slice(0, 2) + '.' + cleaned.slice(2);
  if (cleaned.length <= 8)
    return (
      cleaned.slice(0, 2) + '.' + cleaned.slice(2, 5) + '.' + cleaned.slice(5)
    );
  if (cleaned.length <= 11)
    return (
      cleaned.slice(0, 2) +
      '.' +
      cleaned.slice(2, 5) +
      '.' +
      cleaned.slice(5, 8) +
      '-' +
      cleaned.slice(8)
    );
  return (
    cleaned.slice(0, 2) +
    '.' +
    cleaned.slice(2, 5) +
    '.' +
    cleaned.slice(5, 8) +
    '-' +
    cleaned.slice(8, 11) +
    '-' +
    cleaned.slice(11, 12)
  );
};

/**
 * Detecta si es CI o RUT y formatea apropiadamente
 * @param {string} text - Texto a formatear
 * @returns {string} - Documento formateado
 */
export const formatDocumento = text => {
  const cleaned = text.replace(/[^0-9]/g, '');

  // Si tiene más de 8 dígitos, tratarlo como RUT
  if (cleaned.length > 8) {
    return formatRUT(text);
  } else {
    return formatCI(text);
  }
};

/**
 * Formatea matrícula mientras se escribe
 * @param {string} text - Texto a formatear
 * @returns {string} - Matrícula formateada
 */
export const formatMatricula = text => {
  // Remover caracteres no válidos y convertir a mayúsculas
  let cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

  // Aplicar formato ABC 1234
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 7) {
    return cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
  } else {
    return cleaned.slice(0, 3) + ' ' + cleaned.slice(3, 7);
  }
};

/**
 * Valida un documento (CI o RUT) automáticamente
 * @param {string} documento - Documento a validar
 * @returns {boolean} - True si es válido
 */
export const validateDocumento = documento => {
  const cleaned = documento.replace(/[^0-9]/g, '');

  if (cleaned.length <= 8) {
    return validateCI(documento);
  } else {
    return validateRUT(documento);
  }
};

/**
 * Valida los campos del formulario de nuevo caso
 * @param {Object} formData - Datos del formulario
 * @returns {Object} - Objeto con errores encontrados
 */
export const validateNewCaseForm = formData => {
  const errors = {};

  // Validar matrícula
  if (!formData.matricula) {
    errors.matricula = 'La matrícula es requerida';
  } else if (!validateMatricula(formData.matricula)) {
    errors.matricula = 'Formato inválido. Use: ABC 1234';
  }

  // Validar documento
  if (!formData.documento) {
    errors.documento = 'El documento es requerido';
  } else if (!validateDocumento(formData.documento)) {
    errors.documento = 'CI o RUT inválido';
  }

  // Validar descripción
  if (!formData.descripcion) {
    errors.descripcion = 'La descripción es requerida';
  } else if (formData.descripcion.trim().length < 10) {
    errors.descripcion = 'La descripción debe tener al menos 10 caracteres';
  } else if (formData.descripcion.trim().length > 256) {
    errors.descripcion = 'La descripción no puede exceder los 256 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
