const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const { MecanicoSchema } = require("../schemas/mecanico.schema");
const { validationResult, param } = require("express-validator");
const bcrypt = require("bcrypt");

// Conseguir todos los Mecanicos
router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT Persona.*, Mecanico.*, Telefono.Numero as telefono
      FROM Persona 
      INNER JOIN Mecanico ON Persona.ID_Persona = Mecanico.ID_Persona
      INNER JOIN Telefono ON Persona.ID_Persona = Telefono.ID_Persona;
      `);
    return res.status(200).json({ message: resultado.rows });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
// Conseguir un Mecanico
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
          SELECT Persona.*, Mecanico.*, Telefono.Numero as telefono
            FROM Persona 
          INNER JOIN Mecanico ON Persona.ID_Persona = Mecanico.ID_Persona
          INNER JOIN Telefono ON Telefono.ID_Persona = Mecanico.ID_Persona
            WHERE Mecanico.ID_Mecanico = $1;
        `,
          [idpersona]
        );
        if (resultado.rows.length === 0) {
          return res.status(404).json({ message: "Mecanico no encontrado" });
        }
        return res.status(200).json({ message: resultado.rows[0] });
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }
    }
  }
);

router.get("/:id/reparaciones", async (req, res) => {
  const idMecanico = req.params.id;

  if (!idMecanico || isNaN(parseInt(idMecanico))) {
    return res.status(400).json({ message: "El ID debe ser un número entero" });
  }

  try {
    const resultado = await pool.query(
      `SELECT r.*
       FROM Reparacion r
       INNER JOIN MecanicoRealizaReparacion mrr ON r.ID_Reparacion = mrr.ID_Reparacion
       WHERE mrr.ID_Mecanico = $1;`,
      [idMecanico]
    );
    if (resultado.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay reparaciones para este mecánico" });
    }
    return res.status(200).json({ message: resultado.rows });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/:id/asignar", async (req, res) => {
  const idMecanico = req.params.id;
  const { id_reparacion } = req.body;

  // Validaciones manuales
  if (!idMecanico || isNaN(parseInt(idMecanico))) {
    return res.status(400).json({ message: "El ID debe ser un número entero" });
  }
  if (!id_reparacion || isNaN(parseInt(id_reparacion)) || id_reparacion < 1) {
    return res.status(400).json({
      message: "La id_reparacion debe ser un número válido y mayor a 0",
    });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO MecanicoRealizaReparacion (ID_Mecanico, ID_Reparacion) VALUES($1,$2) RETURNING *;`,
      [idMecanico, id_reparacion]
    );
    return res.status(200).json({
      message: "La reparación fue asignada correctamente",
      data: resultado.rows[0],
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
// Crear un Mecanico
router.post("/", MecanicoSchema, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log({ errors: errors.array() });
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    documento,
    nombre_completo,
    telefono,
    especializacion,
    id_turno,
    Contrasena,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(Contrasena, 10);

    const resultado = await pool.query(
      `
      WITH nueva_persona AS (
          INSERT INTO Persona (Documento, Nombre_Completo, Rol)
          VALUES ($1, $2 ,2) 
          RETURNING ID_Persona
      ),
      nuevo_mecanico AS (
          INSERT INTO Mecanico (Especializacion, ID_Turno, Contrasena, ID_Persona)
          VALUES ($4, $5, $6,(SELECT ID_Persona FROM nueva_persona))
          RETURNING ID_Persona
      )
      INSERT INTO Telefono (ID_Persona, Numero)
      SELECT ID_Persona, $3
      FROM nuevo_Mecanico
      RETURNING *;
    `,
      [
        documento,
        nombre_completo,
        telefono,
        especializacion,
        id_turno,
        hashedPassword,
      ]
    );

    return res.status(200).json({
      message: "El Mecanico fue creado correctamente",
      data: resultado.rows[0],
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: error.message });
  }
});

// Eliminar un Mecanico
router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const idMecanico = req.params.id;
    try {
      const result = await pool.query(
        "DELETE FROM Mecanico WHERE ID_Mecanico = $1",
        [idMecanico]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Mecanico no encontrado" });
      }

      return res
        .status(200)
        .json({ message: "Mecanico eliminado correctamente" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
);
// Editar un Mecanico
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    ...MecanicoSchema,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const ID_Mecanico = req.params.id;
      const {
        documento,
        nombre_completo,
        telefono,
        especializacion,
        id_turno,
      } = req.body;
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        // Primero actualizamos el Mecanico para obtener el ID_Persona
        const mecanicoResult = await client.query(
          `
        UPDATE Mecanico
        SET especializacion = $1, id_turno = $2
        WHERE ID_Mecanico = $3      
        RETURNING ID_Persona
      `,
          [especializacion, id_turno, ID_Mecanico]
        );

        if (mecanicoResult.rowCount === 0) {
          await client.query("ROLLBACK");
          return res.status(404).json({ message: "Mecánico no encontrado" });
        }

        const ID_Persona = mecanicoResult.rows[0].id_persona;

        // Actualizamos Persona
        await client.query(
          `
        UPDATE Persona 
        SET documento = $1, nombre_completo = $2 
        WHERE ID_Persona = $3
      `,
          [documento, nombre_completo, ID_Persona]
        );

        // Actualizamos Telefono
        await client.query(
          `
        UPDATE Telefono
        SET Numero = $1
        WHERE ID_Persona = $2
      `,
          [telefono, ID_Persona]
        );

        await client.query("COMMIT");
        return res
          .status(200)
          .json({ message: "El Mecánico fue editado correctamente" });
      } catch (error) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: error.message });
      } finally {
        client.release();
      }
    }
  }
);

module.exports = router;
