// src/middlewares/auth.middleware.js

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { JWT_ACCESS_SECRET } = require("../config/config");
const { BadRequestError, UnauthorizedError } = require("../errors");
const User = require("../repositories/user.repository");

const mockUsers = require("../constants/mockUsers");

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized, no token provided");
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(404);
      throw new BadRequestError(
        "The user belonging to this token no longer exists.",
      );
    }

    if (user.status === "suspended") {
      res.status(403);
      //   NOTE Change to forbidden error
      throw new Error("Your account has been suspended.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.statusCode) return next(error);

    res.status(401);
    throw new UnauthorizedError("Not authorized or invalid token signature");
  }
});

const isOptionalAuthenticated = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.user = null;
    return next();
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(accessToken, JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.userId);

    req.user = user || null;
    next();
  } catch (error) {
    req.user = user || null;
    next();
  }
});

const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError("You are not authenticated."));
    }

    if (!allowedRoles.includes(req.user.role)) {
      // NOTE Change to forbidden error
      return next(
        new BadRequestError(
          "You do not have permission to perform this action.",
        ),
      );
    }

    next();
  };
};

module.exports = { isAuthenticated, isOptionalAuthenticated, restrictTo };
