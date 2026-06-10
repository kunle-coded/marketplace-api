// src/controllers/product.controller.js

const asyncHandler = require("express-async-handler");
const productService = require("../services/product.service");

/**
 * @description Create a new product
 * @route GET /api/v1/products
 * @access Public
 * @param {object} req
 * @param {object} res
 */
const createProduct = asyncHandler(async (req, res) => {
  const data = await productService.create(req.user, req.body);
  res.status(201).json({ message: "Product created successfully", data });
});

/**
 * @description Get all products
 * @route GET /api/v1/products
 * @access Public
 * @param {object} req
 * @param {object} res
 */
const getProducts = asyncHandler(async (req, res) => {
  const data = await productService.list();
  res.status(200).json({ message: "success", data });
});

/**
 * @description Get single product
 * @route GET /api/v1/products/:id
 * @access Public
 * @param {object} req
 * @param {object} res
 */
const getProductById = asyncHandler(async (req, res) => {
  const data = await productService.getById(req.params.id);
  res.status(200).json({ message: "success", data });
});

/**
 * @description Update existing product
 * @route PATCh /api/v1/products/:id
 * @access Private
 * @param {object} req
 * @param {object} res
 */
const updateProduct = asyncHandler(async (req, res) => {
  const data = await productService.modify(
    req.user.id,
    req.params.id,
    req.body,
  );
  res.status(201).json({ message: "success", data });
});

/**
 * @description Delete existing product
 * @route DELETE /api/v1/products/:id
 * @access Private
 * @param {object} req
 * @param {object} res
 */
const deleteProduct = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id, req.user.id);

  res
    .status(200)
    .json({ status: "success", message: "Product successfully deleted." });
});

const getInventoryProduct = asyncHandler(async (req, res) => {
  const data = await productService.getInventoryById(req.params.productId);

  res.status(200).json({ status: "success", data });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getInventoryProduct,
};
