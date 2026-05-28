require("dotenv").config();

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const DB_CONN = {
  DB_USER: process.env.DB_USER,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
};

module.exports = {
  NODE_ENV,
  PORT,
  DB_CONN,
  SALT_ROUNDS,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
};
