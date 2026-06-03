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
  const updated = await userService.updateUser(req.user.id, req.body);
  res.status(201).json(updated);
});

/**
 * @description Delete own account
 * @route DELETE /api/v1/users/me
 * @access Private
 * @param req
 * @param res
 */
const deleteMe = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await userService.deleteAccount(userId);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth",
  });

  res.status(200).json({
    status: "success",
    message: "Your account has been successfully deleted.",
  });
});

/**
 * @description Delete user account
 * @route DELETE /api/v1/users/:id
 * @access Private + Admin
 * @param req
 * @param res
 */
const deleteUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;

  await userService.deleteAccount(targetId);

  res.status(200).json({
    status: "success",
    message: "User account successfully deleted by administrator.",
  });
});

/**
 * @description Get user profile by id
 * @route GET /api/v1/users/:id
 * @access Public
 * @param req
 * @param res
 */
const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id, req.user);
  res.status(200).json({ status: "success", data: user });
});

module.exports = {
  registerUser,
  getMe,
  updateMe,
  deleteMe,
  getUser,
  deleteUser,
};
