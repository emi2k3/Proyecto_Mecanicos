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

router.post("/completar", async (req, res) => {
  try {
    await pool.query("BEGIN"); // Iniciar transacción

    const { reparacion, repuestos, mecanicos } = req.body;

    // 1. UPDATE en tabla Reparacion
    const updateReparacionQuery = `
      UPDATE Reparacion 
      SET Descripcion = $1, Tiempo = $2, Estado = $3 
      WHERE ID_Reparacion = $4
      RETURNING *`;

    const reparacionResult = await pool.query(updateReparacionQuery, [
      reparacion.descripcion,
      reparacion.tiempo,
      reparacion.estado,
      reparacion.id_reparacion,
    ]);

    // 2. DELETE e INSERT en RepuestosReparacion (para actualizar)
    await pool.query(
      "DELETE FROM RepuestosReparacion WHERE ID_Reparacion = $1",
      [reparacion.id_reparacion]
    );

    for (const repuesto of repuestos) {
      await pool.query(
        "INSERT INTO RepuestosReparacion (ID_Repuesto, ID_Reparacion, Cantidad_Usada) VALUES ($1, $2, $3)",
        [repuesto.id_repuesto, repuesto.id_reparacion, repuesto.cantidad_usada]
      );
    }

    // 3. DELETE e INSERT en MecanicoRealizaReparacion (para actualizar)
    await pool.query(
      "DELETE FROM MecanicoRealizaReparacion WHERE ID_Reparacion = $1",
      [reparacion.id_reparacion]
    );

    for (const mecanico of mecanicos) {
      await pool.query(
        "INSERT INTO MecanicoRealizaReparacion (ID_Mecanico, ID_Reparacion) VALUES ($1, $2)",
        [mecanico.id_mecanico, mecanico.id_reparacion]
      );
    }

    await pool.query("COMMIT"); // Confirmar transacción

    res.status(200).json({
      success: true,
      message: "Reparación completada exitosamente",
      data: {
        reparacion: reparacionResult.rows[0],
        repuestos_actualizados: repuestos.length,
        mecanicos_asignados: mecanicos.length,
      },
    });
  } catch (error) {
    await pool.query("ROLLBACK"); // Revertir transacción en caso de error
    console.error("Error al completar reparación:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});

module.exports = router;
