// src/routes/order.routes.js

const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.middleware");

const orderController = require("../controllers/order.controller");

const router = express.Router();

router.post("/checkout", isAuthenticated, orderController.createOrder);

module.exports = router;
