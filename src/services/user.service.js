// src/services/user.service.js

const cryptoUtil = require("../utils/crypto.util");
const mockUsers = require("../constants/mockUsers");

const createUser = async (data) => {
  const { password, ...restOfUserData } = data;

  const hashedPass = await cryptoUtil.hashPassword(password);

  const databasePayload = {
    ...restOfUserData,
    passwordHash: hashedPass,
  };

  const { passwordHash, ...safeUserOutput } = databasePayload;

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
