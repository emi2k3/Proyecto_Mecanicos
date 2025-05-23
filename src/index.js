const express = require("express");
const cors = require("cors");
const pool = require('../src/database/db.js')
const morgan = require("morgan");
require("dotenv").config();
const indexRoutes = require('./routes/index.routes');
const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});

  // Routes
  app.use('/api', indexRoutes);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
