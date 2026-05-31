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

    const user = User.findById(decoded.id);

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
    res.status(401);
    throw new UnauthorizedError("Not authorized or invalid token signature");
  }
});

module.exports = { isAuthenticated };
