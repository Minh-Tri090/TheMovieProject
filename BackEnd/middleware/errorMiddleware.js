const AppError = require("../utils/appError");

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
}

function errorHandler(error, req, res, next) {
  let normalizedError = error;

  if (error.name === "CastError") {
    normalizedError = new AppError("Invalid resource id", 400);
  } else if (error.name === "ValidationError") {
    normalizedError = new AppError(error.message, 400);
  } else if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    normalizedError = new AppError("Invalid or expired token", 401);
  } else if (error.code === 11000) {
    normalizedError = new AppError("Resource already exists", 409);
  } else if (!(error instanceof AppError)) {
    normalizedError = new AppError(error.message || "Internal server error", 500);
  }

  const statusCode = normalizedError.statusCode || 500;

  res.status(statusCode).json({
    message: normalizedError.message,
  });
}

module.exports = { notFound, errorHandler };
