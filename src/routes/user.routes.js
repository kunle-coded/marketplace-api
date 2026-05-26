const router = require("express").Router();
const userController = require("../controllers/user.controller");

// Register a new user
router.post("/users", userController.registerUser);

// AUTH LEVEL - Login user
router.post("/auth/login", function (req, res) {
  res.status(200).json("Login user");
});

// AUTH LEVEL - View user profile
router
  .route("/users/me")
  .get(userController.getMe)
  .patch(userController.updateMe)
  .delete(userController.deleteMe);

// View user profile
router.get("/users/:id", userController.getUser);

module.exports = router;
