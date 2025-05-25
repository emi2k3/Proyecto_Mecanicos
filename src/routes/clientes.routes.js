const express = require('express');
const router = express.Router();    
const pool = require("../database/db")
const { ClienteSchema } = require('../schemas/cliente.schema');
const { validationResult,param } = require('express-validator');  // Añadir esta línea

// Conseguir todos los clientes
router.get('/', async(req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT Persona.*,Cliente.ID_Cliente
      FROM Persona 
      INNER JOIN 
      Cliente ON Persona.ID_Persona = Cliente.ID_Persona;
      `)
      return res.status(200).json({message: resultado.rows});
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
});
// Conseguir un cliente
router.get('/:id', [
  param('id').isInt().withMessage('El ID debe ser un número entero')
], async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  else
  {
    const idpersona = req.params.id;
    try {
      const resultado = await pool.query(`
        SELECT Persona.*,Cliente.ID_Cliente
        FROM Persona 
        INNER JOIN 
        Cliente ON Persona.ID_Persona = Cliente.ID_Persona
        WHERE Cliente.ID_Cliente = $1;
        `,[idpersona])
        if (resultado.rows.length === 0) {
          return res.status(404).json({ message: "Cliente no encontrado" });
        }
        return res.status(200).json({message: resultado.rows[0]});
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  }

 
});

router.post('/', ClienteSchema, async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  else
  {
    const { documento, nombre_completo } = req.body;
    try {
      await pool.query(`
    WITH nueva_persona AS (
        INSERT INTO Persona (Documento, Nombre_Completo)
         VALUES ($1, $2) 
         RETURNING ID_Persona
    ) 
    INSERT INTO Cliente (ID_Persona)
    SELECT ID_Persona FROM nueva_persona;
    `,[documento,nombre_completo]);
    return res.status(200).json({message: "El cliente fue creado correctamente"});
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  }
});

// Eliminar un cliente
router.delete('/:id', [
  param('id').isInt().withMessage('El ID debe ser un número entero')
], async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const idCliente = req.params.id;
  try {
    const result = await pool.query('DELETE FROM Cliente WHERE ID_Cliente = $1', [idCliente]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    return res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/:id',
  [ClienteSchema, param('id').isInt().withMessage('El ID debe ser un número entero')], async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  else
  {
    const idpersona = req.params.id;
    const { documento, nombre_completo } = req.body;
    try {
      await pool.query(`
      UPDATE Persona 
      SET documento = $1 , nombre_completo = $2 
      FROM Cliente
      WHERE Persona.ID_Persona = Cliente.ID_Persona AND
      Cliente.ID_Cliente = $3;
    `,[documento,nombre_completo,idpersona]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    return res.status(200).json({message: "El cliente fue editado correctamente"});
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  }

});

module.exports = router;