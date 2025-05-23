const express = require('express');
const router = express.Router();    

router.get('/', (req, res) => {
  res.json({
    message: "Lista de reparaciones"
  });
});

module.exports = router;