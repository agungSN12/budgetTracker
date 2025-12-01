const express = require("express");
const app = express();
const {
  enableCORS,
  setSecurityHeaders,
} = require("./middlewares/security.middleware");
require("./store/sequelize");
const ErrorHandler = require("./middlewares/ErrorHandler.middleware");
const routes = require("./routes");

app.use(express.json());
app.use(enableCORS);
app.use(setSecurityHeaders);

app.use("/api/v1", routes);
app.use(ErrorHandler);
app.use((err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

module.exports = app;
