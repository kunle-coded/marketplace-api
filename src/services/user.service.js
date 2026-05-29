// src/services/user.service.js

const cryptoUtil = require("../utils/crypto.util");
const mockUsers = require("../constants/mockUsers");
const uuid = require("node:crypto");
const User = require("../repositories/user.repository");

const createUser = async (data) => {
  const { password, ...restOfUserData } = data;

  const hashedPass = await cryptoUtil.hashPassword(password);

  const databasePayload = {
    id: uuid.randomUUID(),
    ...restOfUserData,
    passwordHash: hashedPass,
  };

  const user = await User.save(databasePayload);

  const { password_hash, balance_in_cents, ...safeUserOutput } = user;

  return { message: "User created successfully", data: safeUserOutput };
};

const getProfile = async (authenticatedUser) => {
  if (!authenticatedUser || !authenticatedUser.id) {
    throw new Error("Invalid user context provided");
  }

  return {
    id: authenticatedUser.id,
    email: authenticatedUser.email,
    firstName: authenticatedUser.firstName,
    lastName: authenticatedUser.lastName,
    role: authenticatedUser.role,
  };
};

module.exports = { createUser, getProfile };
