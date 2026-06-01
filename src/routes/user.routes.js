// src/services/user.routes.js

const router = require("express").Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const {
  isAuthenticated,
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
  .get(userController.getUser)
  .delete(
    isAuthenticated,
    restrictTo("admin", "super-admin"),
    userController.deleteUser,
  );

// Get admin dashboard
router.get(
  "/admin/dashboard",
  isAuthenticated,
  restrictTo("admin"),
  userController.getAdminDashboard,
);

module.exports = router;
