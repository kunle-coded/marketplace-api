// src/repositories/inventory.repository.js

const db = require("../config/database");
const { camelToSnake } = require("../utils/helper.util");

/**
 * List inventory catalog table
 * @param {number} [limit=10] - The maximum number of product records to return per page. Must be greater than or equal to 0.
 * @param {number} [offset=0] - The number of product records to skip before beginning to return rows. Used for navigating pages.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of product row objects. Returns an empty array if no records match.
 */
const findAll = async (limit = 10, offset = 0) => {
  const query = `
    SELECT id, product_id, quantity_on_hand, quantity_allocated, warehouse_location
    FROM inventory
    LIMIT $1 OFFSET $2;
  `;
  const result = await db.query(query, [limit, offset]);

  return result.rows || [];
};

/**
 * Finds a product by product ID from the inventory catalog table
 * @param {string} productId - The UUID of the product
 * @returns Returns the product that matches the given ID or null if no match
 */
const findByProductId = async (productId) => {
  const query = `
    SELECT id, product_id, quantity_on_hand, quantity_allocated, warehouse_location
    FROM inventory
    WHERE product_id = $1
    LIMIT 1;
    `;

  const result = await db.query(query, [productId]);

  return result.rows[0] || null;
};

/**
 * Finds a product by ID from the inventory catalog table
 * @param {string} id - The UUID of the product
 * @returns Returns the product that matches the given ID or null if no match
 */
const findById = async (id) => {
  const query = `
    SELECT id, product_id, quantity_on_hand, quantity_allocated, warehouse_location
    FROM inventory
    WHERE id = $1
    LIMIT 1;
    `;

  const result = await db.query(query, [id]);

  return result.rows[0] || null;
};

/**
 * Updates a product's inventory stock counts for a specific warehouse
 * @param {string} productId - The UUID of the product
 * @param {string} warehouseLocation - Which warehouse stock to update
 * @param {Object} stockPayload - e.g., { quantityOnHand: 100, quantityAllocated: 5 }
 */
const findAndUpdateInventory = async (
  productId,
  warehouseLocation,
  payload,
) => {
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

  const productIdPlaceholderIndex = keys.length + 1;
  const warehousePlaceholderIndex = keys.length + 2;

  queryValues.push(productId);
  queryValues.push(warehouseLocation);

  const query = `
    UPDATE inventory
    SET ${setClauses.join(", ")}
    WHERE product_id = $${productIdPlaceholderIndex} AND warehouse_location = $${warehousePlaceholderIndex}
    RETURNING id, product_id, quantity_on_hand, quantity_allocated, warehouse_location;
    `;

  const result = await db.query(query, queryValues);

  return result.rows[0];
};

module.exports = { findAll, findAndUpdateInventory, findByProductId, findById };
