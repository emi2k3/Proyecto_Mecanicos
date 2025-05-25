const express = require('express');
const router = express.Router();    

router.get('/', (req, res) => {
  res.json({
    message: "Lista de telefonos"
  });
});

module.exports = router;