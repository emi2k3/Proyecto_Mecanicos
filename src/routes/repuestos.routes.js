const express = require('express');
const router = express.Router();    
const pool = require("../database/db")
const { RepuestoSchema } = require('../schemas/repuestos.schema');
const { validationResult,param } = require('express-validator');  

router.get('/', async(req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT * FROM Repuesto;
    `);
    if (resultado.rowCount === 0) {
      return res.status(404).json({message: "No hay repuestos"});
    }
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
    const idrepuesto = req.params.id;
    try {
      const resultado = await pool.query(`
        SELECT * FROM Repuesto WHERE ID_Repuesto = $1`, [idrepuesto]);
      if (resultado.rowCount === 0) {
        return res.status(404).json({message: "Repuesto no encontrado"});
      }
      return res.status(200).json({message: resultado.rows[0]});
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  }
});

router.post('/', RepuestoSchema, async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  else
  {
    const { descripcion, cantidad, tipo } = req.body;
    try {
      const resultado = await pool.query(`
      INSERT INTO Repuesto (Descripcion, Cantidad, Tipo) VALUES ($1, $2, $3)
      RETURNING *
    `, [descripcion, cantidad, tipo]);
    return res.status(200).json({message: "Repuesto creado correctamente", data: resultado.rows[0]});
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
  }
});

router.put('/:id', [
  param('id').isInt().withMessage('El ID debe ser un número entero'),
  RepuestoSchema
], async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  else
  {
    const ID_Repuesto = req.params.id;
    const { descripcion, cantidad, tipo } = req.body;
    try {
      const resultado = await pool.query(`
      UPDATE Repuesto SET Descripcion = $1, Cantidad = $2, Tipo = $3 WHERE ID_Repuesto = $4
      RETURNING *
    `, [descripcion, cantidad, tipo, ID_Repuesto]);
    return res.status(200).json({message: "Repuesto actualizado correctamente", data: resultado.rows[0]});
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
    const ID_Repuesto = req.params.id;
    try {
      const resultado = await pool.query(`
      DELETE FROM Repuesto WHERE ID_Repuesto = $1
      RETURNING *
    `, [ID_Repuesto]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({message: "Repuesto no encontrado"});
    }
    return res.status(200).json({message: "Repuesto eliminado correctamente"});
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
  }
});

module.exports = router;