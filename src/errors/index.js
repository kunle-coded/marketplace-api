// src/errors/index.js

const AppError = require("./AppError");
const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");
const UnauthorizedError = require("./UnauthorizedError");
const ForbiddenError = require("./ForbiddenError");

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
};
