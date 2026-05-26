// src/constants/mockUsers.js

const mockUsers = [
  {
    id: "usr_01JK8W6Z78XYZ1234567890AAA",
    email: "admin@marketplace.com",
    passwordHash:
      "$2b$10$e7vW1hK/5uXGqXk6Z9y2uO3K7f6tYgZ7h8i9j0k1l2m3n4o5p6q7r", // Simulated bcrypt hash for 'AdminPass123!'
    firstName: "Sarah",
    lastName: "Connor",
    role: "admin",
    balanceInCents: 0, // Admins don't need a balance
    status: "active",
    createdAt: "2026-01-15T08:30:00.000Z",
    updatedAt: "2026-05-20T14:22:18.000Z",
  },
  {
    id: "usr_01JK8W7A89ABC3456789012BBB",
    email: "alex.seller@gmail.com",
    passwordHash:
      "$2b$10$x8wX2iL/6vYHrYl7A0z3vP4L8g7uZhA8i9j0k1l2m3n4o5p6q7r8s", // Simulated bcrypt hash for 'SellerPass123!'
    firstName: "Alex",
    lastName: "Vance",
    role: "seller",
    balanceInCents: 145050, // $1,450.50 stored in cents to avoid floating-point errors
    status: "active",
    createdAt: "2026-02-01T11:15:30.000Z",
    updatedAt: "2026-05-25T09:12:00.000Z",
  },
  {
    id: "usr_01JK8W8B90DEF5678901234CCC",
    email: "johndoe@outlook.com",
    passwordHash:
      "$2b$10$y9yY3jM/7wZIsZm8B1a4wQ5M9h8vAiB9j0k1l2m3n4o5p6q7r8s9t", // Simulated bcrypt hash for 'BuyerPass123!'
    firstName: "John",
    lastName: "Doe",
    role: "buyer",
    balanceInCents: 50000, // $500.00
    status: "active",
    createdAt: "2026-03-10T16:45:00.000Z",
    updatedAt: "2026-05-24T18:30:22.000Z",
  },
  {
    id: "usr_01JK8W9C01GHI6789012345DDD",
    email: "jane.buyer@yahoo.com",
    passwordHash:
      "$2b$10$z0zZ4kN/8xAJtAn9C2b5xR6N9i9wBjC0j1k2l3m4n5o6p7q8r9s0u", // Simulated bcrypt hash for 'JanePass123!'
    firstName: "Jane",
    lastName: "Smith",
    role: "buyer",
    balanceInCents: 7525, // $75.25
    status: "suspended", // Perfect for testing your authentication/authorization blockades
    createdAt: "2026-04-02T09:00:00.000Z",
    updatedAt: "2026-05-15T11:05:43.000Z",
  },
];

module.exports = mockUsers;
