const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const { ClienteSchema } = require("../schemas/cliente.schema");
const { validationResult, param } = require("express-validator"); // Añadir esta línea

// Conseguir todos los clientes
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT Persona.*, Cliente.ID_Cliente, Telefono.Numero as telefono
      FROM Persona 
      INNER JOIN Cliente ON Persona.ID_Persona = Cliente.ID_Persona
      INNER JOIN Telefono ON Persona.ID_Persona = Telefono.ID_Persona;
      `);
    return res.status(200).json({ message: resultado.rows });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
// Conseguir un cliente
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const idpersona = req.params.id;
      try {
        const resultado = await pool.query(
          `
          SELECT Persona.*, Cliente.ID_Cliente, Telefono.Numero as telefono
            FROM Persona 
          INNER JOIN Cliente ON Persona.ID_Persona = Cliente.ID_Persona
          INNER JOIN Telefono ON Telefono.ID_Persona = Cliente.ID_Persona
            WHERE Cliente.ID_Cliente = $1;
        `,
          [idpersona]
        );
        if (resultado.rows.length === 0) {
          return res.status(404).json({ message: "Cliente no encontrado" });
        }
        return res.status(200).json({ message: resultado.rows[0] });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
);
// Crear un cliente
router.post("/", ClienteSchema, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { documento, nombre_completo, telefono } = req.body;
  try {
    const resultado = await pool.query(
      `
      WITH nueva_persona AS (
          INSERT INTO Persona (Documento, Nombre_Completo, Rol)
          VALUES ($1, $2, 1) 
          RETURNING ID_Persona
      ),
      nuevo_cliente AS (
          INSERT INTO Cliente (ID_Persona)
          SELECT ID_Persona FROM nueva_persona
          RETURNING ID_Persona
      )
      INSERT INTO Telefono (ID_Persona, Numero)
      SELECT ID_Persona, $3
      FROM nuevo_cliente
      RETURNING *
      `,
      [documento, nombre_completo, telefono]
    );

    return res.status(200).json({
      message: "El cliente fue creado correctamente",
      data: resultado.rows[0],
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Eliminar un cliente
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const idCliente = req.params.id;
    try {
      const result = await pool.query(
        "DELETE FROM Cliente WHERE ID_Cliente = $1",
        [idCliente]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Cliente no encontrado" });
      }

      return res
        .status(200)
        .json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
);
// Editar un cliente
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    ...ClienteSchema,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const idpersona = req.params.id;
      const { documento, nombre_completo, telefono } = req.body;
      try {
        const resultado = await pool.query(
          `
      WITH persona_actualizada AS (
        UPDATE Persona 
        SET documento = $1, nombre_completo = $2 
        FROM Cliente
        WHERE Persona.ID_Persona = Cliente.ID_Persona 
        AND Cliente.ID_Cliente = $3
        RETURNING Persona.ID_Persona
      )
      UPDATE Telefono
      SET Numero = $4
      WHERE ID_Persona = (SELECT ID_Persona FROM persona_actualizada)
    `,
          [documento, nombre_completo, idpersona, telefono]
        );

        if (resultado.rowCount === 0) {
          return res.status(404).json({ message: "Cliente no encontrado" });
        }
        return res
          .status(200)
          .json({ message: "El cliente fue editado correctamente" });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
);

module.exports = router;
