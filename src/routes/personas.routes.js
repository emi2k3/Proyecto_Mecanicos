const express = require('express');
const router = express.Router();    

router.get('/', (req, res) => {
  res.json({
    message: "Lista de personas"
  });
});

module.exports = router;