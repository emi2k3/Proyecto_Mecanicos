const { body } = require("express-validator");

const TelefonoSchema = [
  body("numero")
    .notEmpty()
    .withMessage("El teléfono es requerido")
    .isString()
    .withMessage("El teléfono debe ser texto")
    .matches(/^[0-9]{9}$/)
    .withMessage("El teléfono debe tener 9 dígitos"),

  body("id_persona")
    .notEmpty()
    .withMessage("El id_persona es requerido")
    .isInt({ min: 1 })
    .withMessage("El ID de la persona debe ser un número válido"),
];

module.exports = {
  TelefonoSchema,
};
