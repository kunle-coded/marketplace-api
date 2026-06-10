// src/repositories/order.repository.js

const db = require("../config/database");

/**
 * Save a new order to the orders table
 * @param {Object} payload An Object containing the order details.
 * @returns {Promise<Object>} A promise that resolves to the newly saved order object. Returns a null if order not successfully saved.
 * @throws {DatabaseError} Throws an error if the underlying PostgreSQL query execution fails.
 */
const save = async (orderPayload, orderItemsPayload) => {
  await db.query("BEGIN");

  try {
    const orderQuery = `
    INSERT INTO orders (buyer_id, subtotal, tax, shipping_fee, total, shipping_name,
    shipping_address_line1, shipping_address_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id;
    `;

    const orderValues = [
      orderPayload.buyerId,
      orderPayload.subtotal,
      orderPayload.tax,
      orderPayload.shippingFee,
      orderPayload.total,
      orderPayload.shippingName,
      orderPayload.shippingAddress1,
      orderPayload.shippingAddress2,
      orderPayload.shippingCity,
      orderPayload.shippingState,
      orderPayload.shippingPostalCode,
      orderPayload.shippingCountry,
    ];

    const orderResult = await db.query(orderQuery, orderValues);
    const newOrderId = orderResult.rows[0].id;

    const itemQuery = `
    INSERT INTO order_items (order_id, product_id, historical_name, price_at_purchase, quantity, warehouse_location)
    VALUES ($1, $2, $3, $4, $5, $6)
    `;

    for (const item of orderItemsPayload) {
      const itemValues = [
        newOrderId,
        item.productId,
        item.historicalName,
        item.priceAtPurchase,
        item.quantity,
        item.warehouseLocation,
      ];

      await db.query(itemQuery, itemValues);
    }

    await db.query("COMMIT");

    return { orderId: newOrderId };
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};

const findAll = async (limit = 10, offset = 0) => {
  const query = `
    SELECT id, buyer_id, subtotal, tax, shipping_fee, total
    FROM orders
    LIMIT $1 OFFSET $2;
  `;

  const result = await db.query(query, [limit, offset]);

  return result.rows;
};

const findByBuyerId = async (buyerId, limit = 10, offset = 0) => {
  const query = `
    SELECT id, buyer_id, subtotal, tax, shipping_fee, total
    FROM orders
    WHERE buyer_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;
  `;

  const result = await db.query(query, [buyerId, limit, offset]);

  return result.rows;
};

module.exports = { save, findAll, findByBuyerId };
