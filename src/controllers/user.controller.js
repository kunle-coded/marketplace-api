// src/controllers/user.controller.js

const asyncHandler = require("express-async-handler");
const mockUsers = require("../constants/mockUsers");
const userService = require("../services/user.service");

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
  res.status(200).json(mockUsers[0]);
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
      `User ${mockUsers[0].firstName} ${mockUsers[0].lastName} updated successfully.`,
    );
});

/**
 * @description Delete user
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

module.exports = { registerUser, getMe, updateMe, deleteMe, getUser };
