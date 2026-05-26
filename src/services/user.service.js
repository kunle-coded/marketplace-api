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

module.exports = { createUser };
