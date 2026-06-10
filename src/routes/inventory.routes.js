// src/routes/inventory.routes.js

const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const inventoryController = require("../controllers/inventory.controller");

const router = express.Router();

router.get("/:inventoryId", inventoryController.getInventoryById);

router.patch(
  "/:productId",
  isAuthenticated,
  inventoryController.updateInventory,
);

module.exports = router;
