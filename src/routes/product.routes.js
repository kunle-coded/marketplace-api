// src/routes/product.routes.js

const express = require("express");
const productController = require("../controllers/product.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, productController.createProduct)
  .get(productController.getProducts);

router.get("/:id", productController.getProductById);

router.patch("/:id", isAuthenticated, productController.updateProduct);

router.delete("/:id", isAuthenticated, productController.deleteProduct);

router.get("/:productId/inventory", productController.getInventoryProduct);

module.exports = router;
