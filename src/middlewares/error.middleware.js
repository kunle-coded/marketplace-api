// src/middlewares/error.middleware.js

const { stack } = require("../app");
const { NODE_ENV } = require("../config/config");
const { BadRequestError } = require("../errors");

const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let status = error.status || "error";
  let message = error.message;

  if (NODE_ENV === "development") {
    return res.status(statusCode).json({
      status,
      message,
      stack: error.stack,
      error,
    });
  }

  if (NODE_ENV === "production") {
    if (error.code === "23505") {
      const dbError = new BadRequestError(
        "This record already exists in our database.",
        statusCode,
      );
      statusCode = dbError.statusCode;
      status = dbError.status;
      message = dbError.message;
      error.isOperational = true;
    }

    if (error.isOperational) {
      return res.status(statusCode).json({ status, message });
    }

    console.error("💥 SYSTEM ERROR:", error);

    return res.status(500).json({
      status: "error",
      message: "Something went completely wrong on our end.",
    });
  }
};

module.exports = errorHandler;
