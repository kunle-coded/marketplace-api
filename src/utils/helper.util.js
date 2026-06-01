// src/utils/helper.util.js

const camelToSnake = (str = "") =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

module.exports = { camelToSnake };
