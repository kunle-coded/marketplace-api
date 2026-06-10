// src/services/inventory.service.js

const { NotFoundError } = require("../errors");
const Inventory = require("../repositories/inventory.repository");

const getById = async (id) => {
  const product = await Inventory.findById(id);

  if (!product) {
    throw new NotFoundError(`Product with ID ${id} not found.`);
  }

  return product;
};

const modify = async (productId, warehouseLocation, dataToUpdate) => {
  const updatedInventory = await Inventory.findAndUpdateInventory(
    productId,
    warehouseLocation,
    dataToUpdate,
  );

  if (!updatedInventory) {
    throw new NotFoundError(
      `Product with ID ${productId} not found in inventory.`,
    );
  }

  return updatedInventory;
};

module.exports = { getById, modify };
