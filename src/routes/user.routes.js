// src/services/user.routes.js

const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

// Register a new user
router.post("/", userController.registerUser);

// AUTH LEVEL - View user profile
router
  .route("/me")
  .get(isAuthenticated, userController.getMe)
  .patch(isAuthenticated, userController.updateMe)
  .delete(isAuthenticated, userController.deleteMe);

// View user profile
router.get("/:id", userController.getUser);

module.exports = router;
