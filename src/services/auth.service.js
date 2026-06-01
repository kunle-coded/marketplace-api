// src/services/auth.service.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtUtil = require("../utils/jwt.util");
const cryptoUtil = require("../utils/crypto.util");
const { JWT_REFRESH_SECRET } = require("../config/config");
const { BadRequestError } = require("../errors");

const User = require("../repositories/user.repository");

const mockUsers = require("../constants/mockUsers");

const loginUser = async (email, password) => {
  const user = await User.findByEmailWithPassword(email);

  if (!user) {
    throw new BadRequestError("Invalid email or password");
  }

  if (user.status === "suspended") {
    //NOTE Create ForbiddenError (403) class later and throw here
    throw new Error("This account has been suspended. Please contact support.");
  }

  const isPasswordValid = await cryptoUtil.comparePassword(
    password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new BadRequestError("Invalid email or password");
  }

  const accessToken = jwtUtil.generateAccessToken({
    id: user.id,
    role: user.role,
  });
  const refreshToken = jwtUtil.generateRefreshToken({ id: user.id });

  const { passwordHash, ...safeUser } = user;

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
      //NOTE Create ForbiddenError (403) class later and throw here
      throw new Error("User session is invalid or suspended");
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

// const logoutUser = (user, res) => {
//   const userExist = mockUsers.find((u) => u.id === user.id);

//   if (!userExist) {
//     throw new Error("User does not exist");
//   }
// };

module.exports = { loginUser, refreshSession };
