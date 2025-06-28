const { body } = require("express-validator");

const RepuestoSchema = [
  body("descripcion")
    .notEmpty()
    .withMessage("La descripcion es requerido")
    .isString()
    .withMessage("La descripcion debe ser texto")
    .isLength({ max: 36 })
    .withMessage("La descripcion no puede exceder 36 caracteres"),

  body("tipo")
    .notEmpty()
    .withMessage("El tipo es requerido")
    .isString()
    .withMessage("El tipo debe ser texto")
    .isLength({ max: 36 })
    .withMessage("El tipo no puede exceder 36 caracteres"),

  body("cantidad")
    .notEmpty()
    .withMessage("La cantidad es requerida")
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número válido"),
];

module.exports = {
  RepuestoSchema,
};
