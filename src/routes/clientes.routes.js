const express = require('express');
const router = express.Router();    
const { query, validationResult } = require('express-validator');

router.get('/', (req, res) => {
  res.json({
    message: "Lista de clientes"
  });
});

router.post('/', query('').escape(), (req, res) => {
  res.json({
    message: "Lista de clientes"
  });
});

module.exports = router;