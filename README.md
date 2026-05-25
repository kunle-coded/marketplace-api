# Marketplace API

A production-grade, highly scalable RESTful API built with Node.js and Express representing a modern e-commerce multi-vendor marketplace. This architecture is built with an uncompromising focus on clean separation of concerns, data integrity, and resilience.

Designed explicitly as a portfolio showcase of enterprise-level backend engineering, this system implements architectural patterns that solve real-world marketplace problems—such as concurrency anomalies, race conditions, atomic financial transactions, and request boundary validation.

---

## 1. Architectural Design & Patterns

This system rejects the classic monolithic script approach in favor of a strictly decoupled **3-Tier / Clean Architecture** pattern. This ensures that business components can be individually maintained, tested in isolation, or refactored without breaking outer boundaries.

```

        [ Client Request ]
                │
                ▼

    ┌───────────────────────┐
    │ Routing Layer         │   ──► Global Middlewares (Rate Limiter, Auth, CORS)
    └───────────────────────┘
                │
                ▼

    ┌───────────────────────┐
    │ Controller Layer      │ ──► HTTP Request Parsing & Schema Validation (Zod)
    └───────────────────────┘
                │
                ▼

    ┌───────────────────────┐
    │ Service Layer         │ ──► Core Marketplace Business Rules & Orchestration
    └───────────────────────┘
                │
                ▼

    ┌───────────────────────┐
    │ Repository Layer      │ ──► Database Abstraction (Prisma / Raw SQL Queries)
    └───────────────────────┘
                │
                ▼

        [ Database / Redis ]
```

### Core Architectural Guardrails Implemented:

- **Strict Unidirectional Data Flow:** Outer layers can import inner layers, but inner layers have zero knowledge of the transport mechanism. The Service layer contains pure JS/TS types and business rules—it contains no references to Express `req` or `res` objects.
- **Database Transactions (ACID):** Marketplace actions like buying an item invoke atomic database transactions at the repository level. If inventory deduction succeeds but balance transfer fails, the entire operations rolls back securely.
- **Centralized Error Handling:** All asynchronous operational errors are captured by an abstract wrapper and channeled to a centralized Express error-handling middleware. No database stack traces are leaked to clients; errors are mapped to clean, immutable HTTP response schemas.
- **Input Sanitization & Contract Validation:** The application enforces a Zero-Trust perimeter. Every payload entering the system is evaluated at the controller boundary using Zod schemas. Invalid payloads are immediately rejected before ever allocating memory or CPU resources in the service layer.

---

## 2. Technical Stack

- **Runtime Environment:** Node.js (v20+ LTS)
- **Language:** TypeScript (Strict Mode configured)
- **Web Framework:** Express.js
- **Database Layer:** PostgreSQL (Relational integrity for core marketplace entities)
- **Caching & Idempotency Layer:** Redis
- **Data Validation:** Zod
- **Authentication Strategy:** JWT (Stateless access tokens paired with rotating refresh tokens stored in HTTP-Only, Secure, SameSite cookies)
- **Security Essentials:** Helmet, CORS policies, express-rate-limit

---

## 3. Directory Structure

The repository layout is structured to maintain maximum readability and predictability as features scale:

```text
src/
├── config/             # Immutable configuration objects and database clients
├── constants/          # Application-wide enumerations, status codes, and message strings
├── controllers/        # HTTP handlers; maps incoming client parameters to service triggers
├── errors/             # Extended custom operational error classes (e.g., AppError, ConflictError)
├── middlewares/        # Express interceptors (Authentication, Rate Limiting, Error Middleware)
├── models/             # Database-agnostic schema schemas, TypeScript types, and domain models
├── repositories/       # Single-responsibility data-access logic and database operations
├── routes/             # Core resource router aggregators mapping paths to controllers
├── services/           # The domain core; orchestrates marketplace logic and transactions
├── utils/              # Pure utility modules (cryptography wrappers, date engines, formatters)
├── validations/        # Reusable Zod structural contract validation schemas
├── app.js              # Express server setup and global layer orchestration
└── server.js           # Runtime bootstrap script, cluster manager, and graceful shutdown handlers
```

---

## 4. Feature Roadmap

### Completed Framework Foundation

- [x] Vanilla JavaScript development and compilation pipeline
- [x] Centralized, multi-tier operational error architecture
- [x] Global Request/Response middleware engine
- [x] Environment variable parsing and strict encapsulation

### Domain Capabilities (In Development)

- **User Engine:** Multi-role accounts (Buyer, Seller, Admin) backed by RBAC (Role-Based Access Control) authorization.
  Catalog Management: Dynamic product listings with transactional inventory status matching (Available, Pending, Sold).

- **Transactional Order System:** Concurrent purchasing safety utilizing ACID isolations to mitigate double-spending or overselling anomalies.

- **Reviews & Ratings:** Trust-verification layer limiting feedback eligibility strictly to validated purchasers of an asset.

- **Idempotency Engine:** X-Idempotency-Key tracking using Redis to protect checkout routes against duplicate execution errors caused by intermittent network drops.

## 5. Local Setup & Installation

### Prerequisites

Ensure your local development environment has the following installed:

- Node.js (v20.x or higher)
- npm (v10.x or higher)
- PostgreSQL Instance (or Docker Desktop installed)

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/kunle-coded/marketplace-api.git
cd marketplace-api
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory of the project:

```env
# Server Lifecycle Configuration
PORT=8080
NODE_ENV=development

# Database URIs
DATABASE_URL="postgresql://postgres:securepassword@localhost:5432/marketplace_db?schema=public"

# Security & Tokens
JWT_ACCESS_SECRET="your_super_dense_high_entropy_access_secret_key_here"
JWT_REFRESH_SECRET="your_super_dense_high_entropy_refresh_secret_key_here"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Rate Limiting Guardrails
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Initialize the Database

If using an ORM migration tool engine (e.g., Prisma), run your initialization migrations:

```bash
npx prisma migrate dev --name init
```

### 4. Run the Application

**Development Mode (With Hot Reloading / Watcher):**

```bash
npm run dev
```

**Production Build Pipeline:**

```bash
npm run build
npm start
```

---

## 6. License

This project is open-source software licensed under the [MIT License](LICENSE).
