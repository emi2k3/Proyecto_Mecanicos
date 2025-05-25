const { body } = require('express-validator');
const { personaSchema } = require('./persona.schema');

const MecanicoSchema = [
    
    ...personaSchema,

    body('especializacion')
        .notEmpty().withMessage('La especializacion es requerido')
        .isString().withMessage('La especializacion debe ser texto')
        .isLength({ max: 36 }).withMessage('La especializacion no puede exceder 36 caracteres'),

    body('id_turno')
        .notEmpty().withMessage('El turno es requerido')
        .isInt({ min: 1 }).withMessage('El ID del turno debe ser un número válido')
        .isIn([1, 2, 3]).withMessage('El ID del turno debe ser válido')

];

module.exports = {
    MecanicoSchema
};