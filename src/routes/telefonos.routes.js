const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const { TelefonoSchema } = require("../schemas/telefonos.schema");
const { validationResult, param } = require("express-validator");

// Obtener todos los telefonos
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT * FROM Telefono
    `);
    if (resultado.rowCount === 0) {
      return res.status(404).json({ message: "No hay telefonos" });
    }
    return res.status(200).json({ message: resultado.rows });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Obtener un telefono por ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const ID_Telefono = req.params.id;
      try {
        const resultado = await pool.query(
          `
      SELECT * FROM Telefono WHERE ID_Telefono = $1
    `,
          [ID_Telefono]
        );
        if (resultado.rowCount === 0) {
          return res.status(404).json({ message: "Telefono no encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Telefono encontrado", data: resultado.rows[0] });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
);

// Crear un telefono
router.post("/", TelefonoSchema, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } else {
    const { id_persona, numero } = req.body;
    try {
      const resultado = await pool.query(
        `
      INSERT INTO Telefono (ID_Persona, Numero) 
      VALUES ($1, $2)
      RETURNING *
    `,
        [id_persona, numero]
      );
      return res
        .status(200)
        .json({
          message: "Teléfono creado correctamente",
          data: resultado.rows[0],
        });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
});
// Editar un telefono
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    TelefonoSchema,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const idtelefono = req.params.id;
      const { id_persona, numero } = req.body;
      try {
        const resultado = await pool.query(
          `
      UPDATE Telefono 
      SET ID_Persona = $1, Numero = $2 
      WHERE ID_Telefono = $3
      RETURNING *
    `,
          [id_persona, numero, idtelefono]
        );
        if (resultado.rowCount === 0) {
          return res.status(404).json({ message: "Teléfono no encontrado" });
        }
        return res
          .status(200)
          .json({
            message: "Teléfono actualizado correctamente",
            data: resultado.rows[0],
          });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
);
// Eliminar un telefono
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const ID_Telefono = req.params.id;
      try {
        const resultado = await pool.query(
          `
      DELETE FROM Telefono WHERE ID_Telefono = $1
      RETURNING *
    `,
          [ID_Telefono]
        );
        if (resultado.rowCount === 0) {
          return res.status(404).json({ message: "Teléfono no encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Teléfono eliminado correctamente" });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
);

module.exports = router;
