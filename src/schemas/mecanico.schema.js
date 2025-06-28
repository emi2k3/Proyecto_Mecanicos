const { body } = require("express-validator");
const { personaSchema } = require("./persona.schema");

const MecanicoSchema = [
  ...personaSchema,

  body("especializacion")
    .notEmpty()
    .withMessage("La especializacion es requerido")
    .isString()
    .withMessage("La especializacion debe ser texto")
    .isLength({ max: 36 })
    .withMessage("La especializacion no puede exceder 36 caracteres"),

  body("id_turno")
    .notEmpty()
    .withMessage("El turno es requerido")
    .isInt({ min: 1 })
    .withMessage("El ID del turno debe ser un número válido")
    .isIn([1, 2, 3])
    .withMessage("El ID del turno debe ser válido"),

    body("Contrasena")
    .notEmpty()
    .withMessage("La contraseña es requerido")
    .isString()
    .withMessage("La contraseña debe ser texto")
    .isLength({ max: 36, min:5 })
    .withMessage("La contraseña no puede exceder 36 caracteres y debe tener un mínimo de 5 caracteres")
    .matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z0-9]{5,}$").withMessage("Debe tener al menos una letra mayuscula y minúscula, además de un número."),
    
];

module.exports = {
  MecanicoSchema,
};
