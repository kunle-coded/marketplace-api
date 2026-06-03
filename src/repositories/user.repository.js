// src/repositories/user.repository.js

const db = require("../config/database");
const { camelToSnake } = require("../utils/helper.util");

const save = async (payload) => {
  const query = `
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, balance_in_cents, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, email, first_name, last_name, role, created_at;
    `;

  const values = [
    payload.id,
    payload.email,
    payload.passwordHash,
    payload.firstName,
    payload.lastName,
    payload.role,
    payload.balanceInCents,
    payload.status,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};

const findAll = async (limit = 10, offset = 0) => {
  const query = `
    SELECT id, email, first_name, last_name, role, status
    FROM users
    LIMIT $1 OFFSET $2;
    `;

  const result = await db.query(query, [limit, offset]);

  return result.rows;
};

const findByEmail = async (email) => {
  const query =
    "SELECT id, email, first_name, last_name, role, created_at FROM users WHERE email = $1 LIMIT 1";
  const { rows } = await db.query(query, [email.toLowerCase().trim()]);

  return rows[0] || null;
};

const findByEmailWithPassword = async (email) => {
  const query =
    "SELECT id, email, first_name, last_name, password_hash, status FROM users WHERE email = $1 LIMIT 1";
  const { rows } = await db.query(query, [email.toLowerCase().trim()]);

  return rows[0] || null;
};

const findById = async (id) => {
  const query =
    "SELECT id, email, first_name, last_name, role, created_at, status FROM users WHERE id = $1 LIMIT 1";
  const { rows } = await db.query(query, [id]);

  return rows[0] || null;
};

const findAndUpdate = async (id, data) => {
  console.log(id, data);
  const keys = Object.keys(data);
  if (keys.length === 0) return null;

  const setClauses = [];
  const queryValues = [];

  keys.forEach((key, index) => {
    const placeholderIndex = index + 1;

    const columnName = camelToSnake(key);

    setClauses.push(`"${columnName}" = $${placeholderIndex}`);
    queryValues.push(data[key]);
  });

  const idPlaceholderIndex = keys.length + 1;
  queryValues.push(id);

  const query = `
    UPDATE users
    SET ${setClauses.join(", ")}
    WHERE id = $${idPlaceholderIndex}
    RETURNING id, email, first_name, last_name, updated_at;
  `;

  const result = await db.query(query, queryValues);

  return result.rows[0];
};

const deleteOne = async (id) => {
  const query = "DELETE FROM users WHERE id = $1";
  const result = await db.query(query, [id]);

  return result.rowCount > 0;
};

module.exports = {
  save,
  findAll,
  findByEmail,
  findByEmailWithPassword,
  findById,
  findAndUpdate,
  deleteOne,
};
