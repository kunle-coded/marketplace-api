// src/utils/helper.util.js

const slugify = require("slugify");
const crypto = require("node:crypto");

const camelToSnake = (str = "") =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

const generateSlug = (string) => {
  const shortId = crypto.randomBytes(4).toString("hex");
  const slug = `${slugify(string, { lower: true })}-${shortId}`;
  return slug;
};

module.exports = { camelToSnake, generateSlug };
