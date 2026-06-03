// src/services/user.service.js

const cryptoUtil = require("../utils/crypto.util");
const mockUsers = require("../constants/mockUsers");
const uuid = require("node:crypto");
const User = require("../repositories/user.repository");
const { BadRequestError, NotFoundError } = require("../errors");

const createUser = async (data) => {
  const { password, ...restOfUserData } = data;

  const userExists = await User.findByEmail(restOfUserData.email);

  if (userExists) {
    throw new BadRequestError("This email is already registered.");
  }

  const hashedPass = await cryptoUtil.hashPassword(password);

  const databasePayload = {
    id: uuid.randomUUID(),
    ...restOfUserData,
    passwordHash: hashedPass,
    balanceInCents: 0,
    status: "active",
  };

  const user = await User.save(databasePayload);

  const { password_hash, balance_in_cents, ...safeUserOutput } = user;

  return { message: "User created successfully", data: safeUserOutput };
};

const getProfile = async (authenticatedUser) => {
  if (!authenticatedUser || !authenticatedUser.id) {
    throw new BadRequestError("Invalid user context provided.");
  }

  return {
    id: authenticatedUser.id,
    email: authenticatedUser.email,
    firstName: authenticatedUser.firstName,
    lastName: authenticatedUser.lastName,
    role: authenticatedUser.role,
  };
};

const getUserById = async (targetId, currentUser) => {
  const targetUser = await User.findById(targetId);

  if (!targetUser) {
    throw new NotFoundError("User not found.");
  }

  const isTargetAdmin = targetUser.role === "admin";
  const isRequestAdmin = currentUser?.role === "admin";

  if (isTargetAdmin && !isRequestAdmin) {
    throw new NotFoundError("User not found.");
  }

  return targetUser;
};

const getAdminUser = async (authenticatedAdmin) => {
  if (!authenticatedAdmin || !authenticatedAdmin.id) {
    throw new BadRequestError("Invalid user context provided");
  }

  return {
    id: authenticatedAdmin.id,
    email: authenticatedAdmin.email,
    firstName: authenticatedAdmin.first_name,
    lastName: authenticatedAdmin.last_name,
    role: authenticatedAdmin.role,
  };
};

const updateUser = async (id, payload) => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new BadRequestError("No update data provided.");
  }

  const updatedUser = await User.findAndUpdate(id, payload);

  if (!updatedUser) {
    throw new NotFoundError("User not found.");
  }

  return updatedUser;
};

const deleteAccount = async (id) => {
  const isDeleted = await User.deleteOne(id);

  if (!isDeleted) {
    throw new NotFoundError(
      "Failed to delete account. Account does not exist.",
    );
  }

  return isDeleted;
};

module.exports = {
  createUser,
  getProfile,
  getUserById,
  getAdminUser,
  updateUser,
  deleteAccount,
};
