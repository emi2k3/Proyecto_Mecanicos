const express = require('express');
const router = express.Router();   
const pool = require("../database/db")
const { VehiculoSchema } = require('../schemas/vehiculo.schema');
const { validationResult,param } = require('express-validator');  

// Obtener todos los vehiculos
router.get('/', async(req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT * FROM Vehiculo;
    `);
    return res.status(200).json({message: resultado.rows});
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
});

  
router.get('/:id', [
  param('id').isInt().withMessage('El ID debe ser un número entero')
], async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  else
  {
    const ID_Vehiculo = req.params.id;
    try {
      const resultado = await pool.query(`
      SELECT * FROM Vehiculo WHERE ID_Vehiculo = $1
    `, [ID_Vehiculo]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({message: "Vehiculo no encontrado"});
    }
    return res.status(200).json({message: resultado.rows[0]});
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
}
});

router.post('/', VehiculoSchema, async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  else
  {
    const { matricula, tipo, id_cliente, marca, modelo } = req.body;
    try {
      const resultado = await pool.query(`
      INSERT INTO Vehiculo (Matricula, Tipo, ID_Cliente, Marca, Modelo) 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [matricula, tipo, id_cliente , marca , modelo]);
    return res.status(200).json({message: "Vehiculo creado correctamente", data: resultado.rows[0]});
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
  }
  });

  router.put('/:id', [
    param('id').isInt().withMessage('El ID debe ser un número entero'),
    VehiculoSchema
  ], async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });  
  }
  else
  {
    const ID_Vehiculo = req.params.id;
    const { matricula, tipo, id_cliente,marca,modelo } = req.body;
    try {
      const resultado = await pool.query(`
      UPDATE Vehiculo SET Matricula = $1, Tipo = $2, ID_Cliente = $3, Marca = $5, Modelo = $6 WHERE ID_Vehiculo = $4
      RETURNING *
    `, [matricula, tipo, id_cliente, ID_Vehiculo, marca, modelo]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({message: "Vehiculo no encontrado"});
    }
    return res.status(200).json({message: "Vehiculo actualizado correctamente", data: resultado.rows[0]});
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
  }
});
router.delete('/:id', [
  param('id').isInt().withMessage('El ID debe ser un número entero')
], async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  else
  {
    const ID_Vehiculo = req.params.id;
    try {
      const resultado = await pool.query(`
      DELETE FROM Vehiculo WHERE ID_Vehiculo = $1
    `, [ID_Vehiculo]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({message: "Vehiculo no encontrado"});
    }
    return res.status(200).json({message: "Vehiculo eliminado correctamente"});
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
  }
});
module.exports = router;