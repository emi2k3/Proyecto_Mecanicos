const { body } = require("express-validator");

const personaSchema = [
  body("documento")
    .notEmpty()
    .withMessage("El documento es requerido")
    .custom((value) => {
      // CI: 7 u 8 dígitos
      const ciUruguaya = /^\d{7,8}$/;
      // RUT: 12 dígitos
      const rutUruguayo = /^\d{12}$/;

      if (!ciUruguaya.test(value) && !rutUruguayo.test(value)) {
        throw new Error(
          "El documento debe ser una CI (7-8 dígitos) o RUT (12 dígitos) uruguayo válido"
        );
      }
      return true;
    }),

  body("nombre_completo")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isString()
    .withMessage("El nombre debe ser texto")
    .isLength({ max: 36 })
    .withMessage("El nombre no puede exceder 36 caracteres"),

  body("telefono")
    .notEmpty()
    .withMessage("El teléfono es requerido")
    .isString()
    .withMessage("El teléfono debe ser texto")
    .matches(/^\+?[0-9]{8,12}$/)
    .withMessage("El teléfono debe tener al menos 8 dígitos"),
];

module.exports = { personaSchema };
