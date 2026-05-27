// src/utils/crypto.util.js

const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/config");

/**
 * @description Hashes a plain text password.
 * @param {string} password
 * @returns {Promise<string>}
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * @description  plain text password with hashed password
 * @param {string} password
 * @param {string} userPassword
 * @returns {boolean}
 */
const comparePassword = (password, userPassword) => {
  return bcrypt.compare(password, userPassword);
};

module.exports = { hashPassword, comparePassword };
