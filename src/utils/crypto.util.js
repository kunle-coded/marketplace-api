// src/utils/crypto.util.js

const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/config");

/**
 * Hashes a plain text password.
 * @param {string} password
 * @returns {Promise<string>}
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

module.exports = { hashPassword };
