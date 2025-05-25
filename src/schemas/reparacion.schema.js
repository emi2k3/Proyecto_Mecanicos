const { body } = require('express-validator');

const ReparacionSchema = [

    body('descripcion')
        .notEmpty().withMessage('La descripcion es requerido')
        .isString().withMessage('La descripcion debe ser texto')
        .isLength({ max: 36 }).withMessage('La descripcion no puede exceder 36 caracteres'),
    
    body('tiempo')
        .notEmpty().withMessage('El tiempo es requerido')
        .isInt({ min: 1 }).withMessage('El tiempo mínimo es 1 hora')
        .isInt({ max: 168 }).withMessage('El tiempo máximo es 168 horas (1 semana)'),

    body('id_vehiculo')
        .notEmpty().withMessage('El id_vehiculo es requerido')
        .isInt({ min: 1 }).withMessage('El ID del vehiculo debe ser un número válido')

];

module.exports = {
    ReparacionSchema
};
