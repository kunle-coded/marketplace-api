// src/services/auth.service.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtUtil = require("../utils/jwt.util");
const cryptoUtil = require("../utils/crypto.util");
const { JWT_REFRESH_SECRET } = require("../config/config");
const { BadRequestError, ForbiddenError } = require("../errors");

const User = require("../repositories/user.repository");

const mockUsers = require("../constants/mockUsers");

const loginUser = async (email, password) => {
  const user = await User.findByEmailWithPassword(email);

  if (!user) {
    throw new BadRequestError("Invalid email or password");
  }

  if (user.status === "suspended") {
    throw new ForbiddenError(
      "This account has been suspended. Please contact support.",
    );
  }

  const isPasswordValid = await cryptoUtil.comparePassword(
    password,
    user.password_hash,
  );

  if (!isPasswordValid) {
    throw new BadRequestError("Invalid email or password");
  }

  const accessToken = jwtUtil.generateAccessToken({
    id: user.id,
    role: user.role,
  });
  const refreshToken = jwtUtil.generateRefreshToken({ id: user.id });

  const { password_hash, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
};

const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw new BadRequestError("Refresh token missing");
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const user = mockUsers.find((u) => u.id === decoded.userId);

    if (!user || user.status === "suspended") {
      throw new ForbiddenError("User session is invalid or suspended");
    }

    const newAccessToken = jwtUtil.generateAccessToken({
      id: user.id,
      role: user.role,
    });

    return { accessToken: newAccessToken };
  } catch (error) {
    throw new BadRequestError("Invalid or expired refresh token");
  }
};

module.exports = { loginUser, refreshSession };
