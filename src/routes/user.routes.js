// src/services/user.routes.js

const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const orderController = require("../controllers/order.controller");
const {
  isAuthenticated,
  isOptionalAuthenticated,
  restrictTo,
} = require("../middlewares/auth.middleware");

// Register a new user
router.post("/", userController.registerUser);

// AUTH LEVEL - View user profile
router
  .route("/me")
  .get(isAuthenticated, userController.getMe)
  .patch(isAuthenticated, userController.updateMe)
  .delete(isAuthenticated, userController.deleteMe);

// Delete a user - ONLY Admins
router
  .route("/:id")
  .get(isOptionalAuthenticated, userController.getUser)
  .delete(
    isAuthenticated,
    restrictTo("admin", "super-admin"),
    userController.deleteUser,
  );

router.get("/me/orders", isAuthenticated, orderController.getOrders);

module.exports = router;
