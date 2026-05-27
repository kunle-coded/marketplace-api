// src/utils/jwt.util.js

const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require("../config/config");

/**
 * @description Generate access token
 * @param {object} payload
 * @returns {string}
 */
const generateAccessToken = (payload) => {
  const token = jwt.sign(
    { userId: payload.id, role: payload.role },
    JWT_ACCESS_SECRET,
    { expiresIn: "15m" },
  );
  return token;
};

/**
 * @description Generate refresh token
 * @param {object} payload
 * @returns {string}
 */
const generateRefreshToken = (payload) => {
  const token = jwt.sign({ userId: payload.id }, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

module.exports = { generateAccessToken, generateRefreshToken };
