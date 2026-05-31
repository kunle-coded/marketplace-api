// src/repositories/user.repository.js

const db = require("../config/database");

const findByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
  const { rows } = await db.query(query, [email.toLowerCase().trim()]);

  return rows[0] || null;
};

const findById = async (id) => {
  const query = "SELECT * FROM users WHERE id = $1 LIMIT 1";
  const { rows } = await db.query(query, [id]);

  return rows[0] || null;
};

const save = async (payload) => {
  const query = `
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, balance_in_cents, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
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

module.exports = { save, findByEmail, findById };
