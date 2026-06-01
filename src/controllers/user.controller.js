// src/controllers/user.controller.js

const asyncHandler = require("express-async-handler");
const mockUsers = require("../constants/mockUsers");
const userService = require("../services/user.service");

const users = Array.from(mockUsers);

/**
 * @description Register new user
 * @route GET /api/v1/users
 * @access Public
 * @param req
 * @param res
 */
const registerUser = asyncHandler(async (req, res) => {
  const data = await userService.createUser(req.body);
  res.status(201).json(data);
});

/**
 * @description Get user profile
 * @route GET /api/v1/users/me
 * @access Private
 * @param req
 * @param res
 */
const getMe = asyncHandler(async (req, res) => {
  const userData = await userService.getProfile(req.user);
  res.status(200).json(userData);
});

/**
 * @description Update user profile
 * @route PATCH /api/v1/users/me
 * @access Private
 * @param req
 * @param res
 */
const updateMe = asyncHandler(async (req, res) => {
  res
    .status(201)
    .json(
      `User ${users[0].firstName} ${users[0].lastName} updated successfully.`,
    );
});

/**
 * @description Delete own account
 * @route DELETE /api/v1/users/me
 * @access Private
 * @param req
 * @param res
 */
const deleteMe = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      `User ${mockUsers[3].firstName} ${mockUsers[3].lastName} deleted successfully.`,
    );
});

/**
 * @description Delete user account
 * @route DELETE /api/v1/users/:id
 * @access Private
 * @param req
 * @param res
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { passwordHash, ...userData } = mockUsers[0];
  res.status(200).json(userData);
});

/**
 * @description View user profile
 * @route GET /api/v1/users/:id
 * @access Public
 * @param req
 * @param res
 */
const getUser = asyncHandler(async (req, res) => {
  const { passwordHash, ...userData } = mockUsers[0];
  res.status(200).json(userData);
});

/**
 * @description View admin user profile
 * @route GET /api/v1/users/admin/dashboard
 * @access Private
 * @param req
 * @param res
 */
const getAdminDashboard = asyncHandler(async (req, res) => {
  const { passwordHash, ...userData } = mockUsers[0];
  res.status(200).json(userData);
});

module.exports = {
  registerUser,
  getMe,
  updateMe,
  deleteMe,
  getUser,
  deleteUser,
  getAdminDashboard,
};
