const express = require("express");
const router = express.Router();
const clientesRoutes = require("./clientes.routes");
const mecanicoRoutes = require("./mecanico.routes");
const reparacionesRoutes = require("./reparaciones.routes");
const vehiculosRoutes = require("./vehiculos.routes");
const repuestosRoutes = require("./repuestos.routes");
const telefonosRoutes = require("./telefonos.routes");
const authRoutes = require("./auth.routes");
// Prefijos
router.use("/clientes", clientesRoutes);
router.use("/mecanicos", mecanicoRoutes);
router.use("/reparaciones", reparacionesRoutes);
router.use("/telefonos", telefonosRoutes);
router.use("/repuestos", repuestosRoutes);
router.use("/vehiculos", vehiculosRoutes);
router.use("/auth", authRoutes);

module.exports = router;
