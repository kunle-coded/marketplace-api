// src/services/auth.routes.js

const Router = require("express").Router;
const authController = require("../controllers/auth.controller");

const router = Router();

// AUTH LEVEL - Login user
router.post("/login", authController.login);

// Auth LEVEL – Refresh user access
router.get("/refresh", authController.refresh);

// Logout
router.get("/logout", authController.logout);

module.exports = router;
