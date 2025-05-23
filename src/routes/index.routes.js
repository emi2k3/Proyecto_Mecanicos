const express = require('express');
const router = express.Router();
const clientesRoutes = require('./clientes.routes');
const mecanicoRoutes = require('./mecanico.routes');
const personasRoutes = require('./personas.routes');
const vehiculosRoutes = require('./vehiculos.routes');
// Prefijos
router.use('/clientes', clientesRoutes);
router.use('/mecanicos', mecanicoRoutes);
router.use('/personas', personasRoutes);
router.use('/vehiculos', vehiculosRoutes);

module.exports = router;