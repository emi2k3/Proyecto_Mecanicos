const express = require("express");
const router = express.Router();
const {
  ReparacionSchema,
  PUTReparacionSchema,
} = require("../schemas/reparacion.schema");
const { validationResult, param } = require("express-validator");
const pool = require("../database/db");

router.get("/", async (req, res) => {
  try {
    const resultado = await pool.query(`SELECT * FROM Reparacion`);
    if (resultado.rowCount === 0) {
      return res.status(404).json({ message: "No hay reparaciones." });
    }
    return res.status(200).json({ message: resultado.rows });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get(
  "/vehiculo/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ID_Vehiculo = req.params.id;

    try {
      const resultado = await pool.query(
        `SELECT * FROM Vehiculo WHERE ID_Vehiculo = $1`,
        [ID_Vehiculo]
      );

      if (resultado.rowCount === 0) {
        return res.status(404).json({ message: "Vehículo no encontrado." });
      }

      return res.status(200).json({ message: resultado.rows[0] });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

router.get(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      const ID_Reparacion = req.params.id;
      try {
        const resultado = await pool.query(
          `
          SELECT * FROM Reparacion 
          WHERE ID_Reparacion = $1
          RETURNING *`,
          [ID_Reparacion]
        );
        if (resultado.rowCount === 0) {
          return res
            .status(404)
            .json({ message: "No existe una reparación con ese ID." });
        }
        return res
          .status(200)
          .json({ message: "Reparación encontrada", data: resultado.rows[0] });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
  }
);

router.post("/", ReparacionSchema, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { descripcion, tiempo, id_vehiculo } = req.body;
    const resultado = await pool.query(
      `
      INSERT INTO Reparacion 
      (Descripcion, Tiempo, ID_Vehiculo) 
      VALUES ($1, $2, $3)
      RETURNING *`,
      [descripcion, tiempo, id_vehiculo]
    );
    return res.status(200).json({
      message: "La reparación fue creada correctamente",
      data: resultado.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put(
  "/:id",
  [
    param("id").isInt().withMessage("El ID debe ser un número entero"),
    ...PUTReparacionSchema,
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const ID_Reparacion = req.params.id;
      const { descripcion, tiempo, id_vehiculo, estado } = req.body;
      const resultado = await pool.query(
        `
        UPDATE Reparacion
        SET Descripcion = $1, Tiempo = $2, ID_Vehiculo = $3 ,Estado = $5
        WHERE ID_Reparacion = $4
        RETURNING *`,
        [descripcion, tiempo, id_vehiculo, ID_Reparacion, estado]
      );
      if (resultado.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "No se encontró la reparación" });
      }
      return res.status(200).json({
        message: "La reparación fue editada correctamente",
        data: resultado.rows[0],
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

router.delete(
  "/:id",
  [param("id").isInt().withMessage("El ID debe ser un número entero")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const ID_Reparacion = req.params.id;
      const resultado = await pool.query(
        `
        DELETE FROM Reparacion
        WHERE ID_Reparacion = $1
        RETURNING *`,
        [ID_Reparacion]
      );
      if (resultado.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "No se encontró la reparación" });
      }
      return res
        .status(200)
        .json({ message: "La reparación fue eliminada correctamente" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
