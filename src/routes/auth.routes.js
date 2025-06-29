const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const pool = require("../database/db");
const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";

router.post("/login", async (req, res) => {
  const { document, password } = req.body;

  const query = `
        SELECT 
            m.ID_Mecanico,
            m.Contrasena,
            p.rol,
            p.Nombre_Completo AS nombre
        FROM 
            Mecanico m
        JOIN 
            Persona p ON m.ID_Persona = p.ID_Persona
        WHERE 
            p.Documento = $1
        LIMIT 1;
    `;

  try {
    const result = await pool.query(query, [document]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Mecánico no encontrado" });
    }

    const mecanico = result.rows[0];

    // Validar la contraseña
    const isValidPassword = await bcrypt.compare(password, mecanico.contrasena);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: mecanico.id_mecanico,
        nombre: mecanico.nombre,
        documento: document,
        rol: mecanico.rol,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error en loginMecanico:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

module.exports = router;
