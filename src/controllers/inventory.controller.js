// src/controllers/inventory.controller.js

const asyncHandler = require("express-async-handler");
const inventoryService = require("../services/inventory.service");

/**
 * Get product from inventory catalog table
 * @route GET /api/v1/inventory/:inventoryId
 * @access Public
 * @param {object} req
 * @param {object} res
 */
const getInventoryById = asyncHandler(async (req, res) => {
  const data = await inventoryService.getById(req.params.inventoryId);

  res.status(200).json({ status: "success", data });
});

/**
 * Update existing inventory item
 * @route PATCh /api/v1/inventory/:productId
 * @access Private
 * @param {object} req
 * @param {object} res
 */
const updateInventory = asyncHandler(async (req, res) => {
  const data = await inventoryService.modify(
    req.params.productId,
    req.query.warehouse,
    req.body,
  );

  res.status(201).json({ status: "success", data });
});

module.exports = { getInventoryById, updateInventory };
