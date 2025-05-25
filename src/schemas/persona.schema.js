const { body } = require('express-validator'); 

const personaSchema = [

    body('documento')
      .notEmpty().withMessage('El documento es requerido')
      .custom((value) => {
        const ciUruguaya = /^\d{1,2}\.\d{3}\.\d{3}-\d{1}$/;
        const rutUruguayo = /^\d{3}\.\d{3}\.\d{3}$/;
    
        if (!ciUruguaya.test(value) && !rutUruguayo.test(value)) {
          throw new Error('El documento debe ser una CI o RUT uruguayo válido');
        }
        return true;
      }),

    body('nombre_completo')
      .notEmpty().withMessage('El nombre es requerido')
      .isString().withMessage('El nombre debe ser texto')
      .isLength({ max: 36 }).withMessage('El nombre no puede exceder 36 caracteres'),
  
    body('telefono')
      .notEmpty().withMessage('El teléfono es requerido')
      .isString().withMessage('El teléfono debe ser texto')
      .matches(/^[0-9]{9}$/).withMessage('El teléfono debe tener 9 dígitos')
      
  ];
  
  module.exports = { personaSchema };