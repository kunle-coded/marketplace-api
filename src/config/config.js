require("dotenv").config();

const PORT = process.env.PORT;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

module.exports = { PORT, SALT_ROUNDS };
