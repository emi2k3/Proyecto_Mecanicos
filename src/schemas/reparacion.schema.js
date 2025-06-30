const { body } = require("express-validator");

const ReparacionSchema = [
  body("descripcion")
    .notEmpty()
    .withMessage("La descripcion es requerido")
    .isString()
    .withMessage("La descripcion debe ser texto")
    .isLength({ max: 256 })
    .withMessage("La descripcion no puede exceder 256 caracteres"),

  body("matricula")
    .notEmpty()
    .withMessage("La matricula es requerida")
    .isString()
    .withMessage("La matricula debe ser texto")
    .isLength({ min: 7, max: 8 })
    .withMessage("La matricula debe tener entre 7 y 8 caracteres")
    .matches(/^[A-Z]{3} \d{4}$/)
    .withMessage("La matricula debe tener el formato ABC 1234"),
];

const PUTReparacionSchema = [
  ...ReparacionSchema,
  body("estado")
    .notEmpty()
    .withMessage("El estado es requerido")
    .isBoolean()
    .withMessage("El estado debe ser booleano"),
];

module.exports = {
  ReparacionSchema,
  PUTReparacionSchema,
};
