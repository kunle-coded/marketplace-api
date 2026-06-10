// src/repositories/product.repository.js

const db = require("../config/database");
const { camelToSnake } = require("../utils/helper.util");

/**
 * Save a new product to the product catalog table
 * @param {Object}  - An Object containing the product details.
 * @returns {Promise<Object>} A promise that resolves to the newly saved product object. Returns a null if product not successfully saved.
 * @throws {DatabaseError} Throws an error if the underlying PostgreSQL query execution fails.
 */
const save = async (payload) => {
  const query = `
    INSERT INTO products (seller_id, name, description, price, slug, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, seller_id, name, description, price, slug, status;
  `;

  const values = [
    payload.sellerId,
    payload.name,
    payload.description,
    payload.price,
    payload.slug,
    payload.status,
  ];

  const result = await db.query(query, values);

  const queryInv = `
    INSERT INTO inventory (product_id, quantity_on_hand, warehouse_location)
    VALUES ($1, $2, $3);
  `;

  const valuesInv = [
    result.rows[0].id,
    payload.quantity,
    payload.warehouseLocation,
  ];

  await db.query(queryInv, valuesInv);

  return result.rows[0];
};

/**
 * Finds a product by ID from the product catalog table
 * @param {number} [limit=10] - The maximum number of product records to return per page. Must be greater than or equal to 0.
 * @param {number} [offset=0] - The number of product records to skip before beginning to return rows. Used for navigating pages.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of product row objects. Returns an empty array if no records match.
 * @throws {DatabaseError} Throws an error if the underlying PostgreSQL query execution fails.
 */
const findAll = async (limit = 10, offset = 0) => {
  const query = `
        SELECT id, name, description, price, slug
        FROM products
        LIMIT $1 OFFSET $2;
    `;

  const result = await db.query(query, [limit, offset]);

  return result.rows || [];
};

/**
 * Fetch ALL matching products from the product catalog table
 * @param {Array<string>} - Array of the UUIDs of the products.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of product row objects. Returns an empty array if no records match.
 * @throws {DatabaseError} Throws an error if the underlying PostgreSQL query execution fails.
 */
const findAny = async (productIds) => {
  const query = `
    SELECT p.id, p.price, p.name, SUM(i.quantity_on_hand - i.quantity_allocated)::int AS quantity_available
    FROM products p
    INNER JOIN inventory i ON i.product_id = p.id
    WHERE p.id = ANY($1::uuid[])
    GROUP BY p.id, p.price, p.name;
  `;

  const result = await db.query(query, [productIds]);

  return result.rows;
};

/**
 * @description Finds a product by ID from the product catalog table
 * @param {string} productId - The UUID of the product
 * @returns Returns the product that matches the given ID or null if no match
 */
const findById = async (productId) => {
  const query = `
    SELECT id, name, description, price, slug
    FROM products
    WHERE id = $1
    LIMIT 1;
    `;

  const result = await db.query(query, [productId]);

  return result.rows[0] || null;
};

/**
 * @description Dynamically updates the product catalog table
 * @param {string} productId - The UUID of the product
 * @param {Object} payload - Object containing camelCase fields to update (e.g., { name, price })
 * @returns {Promise<Object>} – Returns updated product
 */
const findAndUpdate = async (sellerId, productId, payload) => {
  const keys = Object.keys(payload);

  if (keys.length === 0) return null;

  const setClauses = [];
  const queryValues = [];

  keys.forEach((key, index) => {
    const placeholderIndex = index + 1;

    const columnName = camelToSnake(key);

    setClauses.push(`"${columnName}" = $${placeholderIndex}`);
    queryValues.push(payload[key]);
  });

  const idPlaceholderIndex = keys.length + 1;
  const sellerPlaceholderIndex = keys.length + 2;

  queryValues.push(productId);
  queryValues.push(sellerId);

  const query = `
    UPDATE products
    SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${idPlaceholderIndex} AND seller_id = $${sellerPlaceholderIndex}
    RETURNING id, name, description, price, slug, status;
    `;

  const result = await db.query(query, queryValues);

  return result.rows[0] || null;
};

/**
 * Delete product from the product catalog table
 * @param {string} productId - The UUID of the product
 * @returns {Promise<Object>} – Returns true if product is deleted, otherwise false
 */
const deleteOne = async (productId, sellerId) => {
  const query = "DELETE FROM products WHERE id = $1 AND seller_id = $2";

  const result = await db.query(query, [productId, sellerId]);

  return result.rowCount > 0;
};

/**
 * Finds a product by ID from the inventory catalog table
 * @param {string} productId - The UUID of the product
 * @returns Returns the product that matches the given ID or null if no match
 */
const findByIdInventory = async (productId) => {
  const query = `
    SELECT 
      p.id, 
      p.name, 
      p.description, 
      p.price, 
      p.slug, 
      p.status,
      json_agg(
        json_build_object(
          'inventory_id', i.id,
          'quantity_on_hand', i.quantity_on_hand,
          'quantity_allocated', i.quantity_allocated,
          'quantity_available', (i.quantity_on_hand - i.quantity_allocated),
          'warehouse_location', i.warehouse_location
        )
      ) AS locations
    FROM products p
    INNER JOIN inventory i ON i.product_id = p.id
    WHERE p.id = $1
    GROUP BY p.id;
    `;

  const result = await db.query(query, [productId]);

  return result.rows[0] || null;
};

module.exports = {
  save,
  findAll,
  findAny,
  findById,
  findAndUpdate,
  deleteOne,
  findByIdInventory,
};
