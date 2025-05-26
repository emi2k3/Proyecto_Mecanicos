const express = require('express');
const router = express.Router();    
const pool = require("../database/db")
const { MecanicoSchema } = require('../schemas/mecanico.schema');
const { validationResult,param } = require('express-validator');  

// Conseguir todos los Mecanicos
router.get('/', async(req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT Persona.*, Mecanico.*, Telefono.Numero as telefono
      FROM Persona 
      INNER JOIN Mecanico ON Persona.ID_Persona = Mecanico.ID_Persona
      INNER JOIN Telefono ON Persona.ID_Persona = Telefono.ID_Persona;
      `)
      return res.status(200).json({message: resultado.rows});
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
});
// Conseguir un Mecanico
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
          SELECT Persona.*, Mecanico.*, Telefono.Numero as telefono
            FROM Persona 
          INNER JOIN Mecanico ON Persona.ID_Persona = Mecanico.ID_Persona
          INNER JOIN Telefono ON Telefono.ID_Persona = Mecanico.ID_Persona
            WHERE Mecanico.ID_Mecanico = $1;
        `,[idpersona])
        if (resultado.rows.length === 0) {
          return res.status(404).json({ message: "Mecanico no encontrado" });
        }
        return res.status(200).json({message: resultado.rows[0]});
    } catch (error) {
      return res.status(400).json({message: error.message});
    }
  }

 
});

router.post('/', MecanicoSchema, async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { documento, nombre_completo, telefono, especializacion, id_turno} = req.body;
  try {
    await pool.query(`
      WITH nueva_persona AS (
          INSERT INTO Persona (Documento, Nombre_Completo)
          VALUES ($1, $2) 
          RETURNING ID_Persona
      ),
      nuevo_mecanico AS (
          INSERT INTO Mecanico (Especializacion, ID_Turno, ID_Persona)
          VALUES ($4, $5, (SELECT ID_Persona FROM nueva_persona))
          RETURNING ID_Persona
      )
      INSERT INTO Telefono (ID_Persona, Numero)
      SELECT ID_Persona, $3
      FROM nuevo_Mecanico;
    `, [documento, nombre_completo, telefono, especializacion,id_turno]);

    return res.status(200).json({message: "El Mecanico fue creado correctamente"});
  } catch (error) {
    return res.status(400).json({message: error.message});
  }
});

// Eliminar un Mecanico
router.delete('/:id', [
  param('id').isInt().withMessage('El ID debe ser un número entero')
], async(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const idMecanico = req.params.id;
  try {
    const result = await pool.query('DELETE FROM Mecanico WHERE ID_Mecanico = $1', [idMecanico]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Mecanico no encontrado" });
    }

    return res.status(200).json({ message: "Mecanico eliminado correctamente" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/:id',
  [MecanicoSchema, param('id').isInt().withMessage('El ID debe ser un número entero')], async(req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  else
  {
    const idpersona = req.params.id;
    const {documento, nombre_completo, telefono, especializacion, id_turno} = req.body;
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      await client.query(`
        UPDATE Persona 
        SET documento = $1, nombre_completo = $2 
        FROM Mecanico
        WHERE Persona.ID_Persona = Mecanico.ID_Persona 
        AND Mecanico.ID_Mecanico = $3
      `, [documento, nombre_completo, idpersona]);

      const mecanicoResult = await client.query(`
        UPDATE Mecanico
        SET especializacion = $1, id_turno = $2
        WHERE ID_Mecanico = $3      
        RETURNING ID_Persona
      `, [especializacion, id_turno, idpersona]);

      await client.query(`
        UPDATE Telefono
        SET Numero = $1
        WHERE ID_Persona = $2
      `, [telefono, mecanicoResult.rows[0].id_persona]);

      await client.query('COMMIT');
    
      if (mecanicoResult.rowCount === 0) {
        return res.status(404).json({ message: "Mecánico no encontrado" });
      }
      return res.status(200).json({message: "El Mecánico fue editado correctamente", data: mecanicoResult.rows[0]});
    } catch (error) {
      await client.query('ROLLBACK');
      return res.status(400).json({message: error.message});
    } finally {
      client.release();
    }
  }

});

module.exports = router;