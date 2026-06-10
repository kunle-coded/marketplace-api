// src/controllers/auth.controller.js

const asyncHandler = require("express-async-handler");
const authService = require("../services/auth.service");
const { NODE_ENV } = require("../config/config");

/**
 * @description Authenticate user
 * @route POST api/v1/auth/login
 * @access Public
 * @param {object} req
 * @param {object} res
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(
    email,
    password,
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: NODE_ENV !== "production",
    sameSite: "strict",
    path: "/api/v1/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    message: "login successful",
    data: { user, accessToken },
  });
});

/**
 * @description Refresh user token
 * @route POST api/v1/auth/refresh
 * @access Public
 * @param {object} req
 * @param {object} res
 */
const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const result = await authService.refreshSession(refreshToken);

  res.status(200).json({
    status: "success",
    data: { accessToken: result.accessToken },
  });
});

/**
 * @description Logout user
 * @route GET api/v1/auth/logout
 * @access Private
 * @param {object} req
 * @param {object} res
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth",
  });

  res.status(200).json({ status: "success", message: "Logout successfully" });
});

module.exports = { login, refresh, logout };
