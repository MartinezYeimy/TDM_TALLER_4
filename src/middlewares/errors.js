export function notFound(req, res, next) {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      error: `No existe la ruta: ${req.method} ${req.path}`
    });
  }
  next();
}

export function errorHandler(err, req, res, next) {
  console.error("Error detectado:", err.message);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || "Error inesperado en el servidor"
  });
}