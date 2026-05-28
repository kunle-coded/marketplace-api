// src/config/database.js

const { Pool } = require("pg");
const { DB_CONN, NODE_ENV } = require("./config");

const pool = new Pool({
  user: DB_CONN.DB_USER,
  host: DB_CONN.DB_HOST,
  database: DB_CONN.DB_NAME,
  password: DB_CONN.DB_PASSWORD,
  port: Number(DB_CONN.DB_PORT),
  ssl: NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
