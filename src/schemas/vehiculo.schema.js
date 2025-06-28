const { body } = require("express-validator");

const VehiculoSchema = [
  body("matricula")
    .notEmpty()
    .withMessage("La matricula es requerida")
    .isString()
    .withMessage("La matricula debe ser texto")
    .isLength({ max: 36 })
    .withMessage("La matricula no puede exceder 36 caracteres"),

  body("tipo")
    .notEmpty()
    .withMessage("El tipo es requerido")
    .isString()
    .withMessage("El tipo debe ser texto")
    .isLength({ max: 36 })
    .withMessage("El tipo no puede exceder 36 caracteres"),
  body("marca")
    .notEmpty()
    .withMessage("La marca es requerdida")
    .isString()
    .withMessage("La marca debe ser texto")
    .isLength({ max: 36 })
    .withMessage("La marca no puede exceder 36 caracteres"),
  body("modelo")
    .notEmpty()
    .withMessage("El modelo es requerido")
    .isString()
    .withMessage("El modelo debe ser texto")
    .isLength({ max: 36 })
    .withMessage("El modelo no puede exceder 36 caracteres"),

  body("id_cliente")
    .notEmpty()
    .withMessage("El id_cliente es requerido")
    .isInt({ min: 1 })
    .withMessage("El ID del cliente debe ser un número válido"),
];

module.exports = {
  VehiculoSchema,
};
