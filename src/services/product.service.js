// src/services/product.service.js

const Product = require("../repositories/product.repository");
const { generateSlug } = require("../utils/helper.util");
const { BadRequestError, NotFoundError, ForbiddenError } = require("../errors");

// Save new product
const create = async (user, productData) => {
  if (user.role !== "seller") {
    throw new ForbiddenError(
      "Access denied. Only registered seller accounts have permission to list products.",
    );
  }

  if (!productData) {
    throw new BadRequestError("Product data cannot be empty.");
  }

  const databasePayload = {
    sellerId: user.id,
    ...productData,
    slug: generateSlug(productData.name),
    status: productData.save ? "active" : "draft",
  };
  const result = await Product.save(databasePayload);

  return result;
};

const list = async () => {
  const products = await Product.findAll();

  return products;
};

const getById = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new NotFoundError(`Product with ID ${id} not found.`);
  }

  return product;
};

const modify = async (userId, productId, productData) => {
  const updatedProduct = await Product.findAndUpdate(productId, productData);

  if (!updatedProduct) {
    throw new NotFoundError(`Product with ID ${id} not found.`);
  }

  return updatedProduct;
};

const remove = async (productId, userId) => {
  const isDeleted = await Product.deleteOne(productId, userId);

  if (!isDeleted) {
    throw new NotFoundError(
      "Failed to delete product or product does not exist.",
    );
  }

  return isDeleted;
};

const getInventoryById = async (id) => {
  const product = await Product.findByIdInventory(id);

  if (!product) {
    throw new NotFoundError(`Product with ID ${id} not found.`);
  }

  return product;
};

module.exports = { create, list, getById, modify, remove, getInventoryById };
