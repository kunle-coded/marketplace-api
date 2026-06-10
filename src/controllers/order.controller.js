// src/controllers/order.controller.js

const asyncHandler = require("express-async-handler");
const orderService = require("../services/order.service");

/**
 * Create an order
 * @route POST /api/v1/orders/create
 * @access Private
 * @param {object} req
 * @param {object} res
 */
const createOrder = asyncHandler(async (req, res) => {
  const data = await orderService.create(req.user, req.body);

  res.status(201).json({ status: "success", data });
});

/**
 * Get all orders
 * @route GET /api/v1/orders
 * @access Private
 * @param {object} req
 * @param {object} res
 */
const getOrders = asyncHandler(async (req, res) => {
  const data = await orderService.list(req.user);

  res.status(200).json({ status: "success", data });
});

module.exports = { createOrder, getOrders };
