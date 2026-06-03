// src/controllers/admin.controller.js

const asyncHandler = require("express-async-handler");
const userService = require("../services/user.service");

/**
 * @description View admin user profile
 * @route GET /api/v1/users/admin/dashboard
 * @access Private
 * @param req
 * @param res
 */
const getAdminDashboard = asyncHandler(async (req, res) => {
  const adminUser = await userService.getAdminUser(req.user);
  res.status(200).json(adminUser);
});

module.exports = { getAdminDashboard };
