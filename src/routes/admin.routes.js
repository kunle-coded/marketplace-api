// src/routes/admin.routes.js

const express = require("express");
const adminController = require("../controllers/admin.controller");
const {
  isAuthenticated,
  restrictTo,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/dashboard",
  isAuthenticated,
  restrictTo("admin"),
  adminController.getAdminDashboard,
);

module.exports = router;
