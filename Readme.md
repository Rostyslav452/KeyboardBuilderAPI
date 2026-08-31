# Mechanical Keyboard Builder API

## Overview

Welcome to the **Mechanical Keyboard Builder API**, a RESTful backend application for managing mechanical keyboard components and user-created keyboard builds.

The API provides functionality for user authentication, keyboard parts management, custom keyboard builds, database operations, request validation, error handling, logging, and API security. The project is built with **Node.js, Express, TypeScript, Sequelize, and MySQL** and follows a modular backend architecture.

The application is designed to provide a reliable foundation for a mechanical keyboard builder frontend, allowing users to authenticate, browse available components, and create and manage their own custom keyboard configurations.

## API Documentation

The API documentation is available via Swagger UI:

[Swagger API Documentation](http://localhost:3000/api-docs)

> **Note:** Swagger UI is available only when the API is running locally.

## Key Features

- **User Authentication**: Registration, login, logout, access-token generation, refresh-token rotation, and password reset functionality.
- **JWT Authentication**: Uses access and refresh tokens to securely authenticate users and protect private endpoints.
- **Password Security**: User passwords are securely hashed using `bcrypt` before being stored in the database.
- **Keyboard Parts Management**: Create, retrieve, update, and delete keyboard components.
- **Part Types**: Supports switches, cases, PCBs, and keycaps with type-specific specifications.
- **Keyboard Builds**: Users can create, update, retrieve, and delete their own custom keyboard builds.
- **User Builds**: Provides a dedicated endpoint for retrieving builds belonging to the authenticated user.
- **Pagination**: Supports paginated retrieval of parts and builds.
- **Request Validation**: Validates request bodies and parameters using `Zod`.
- **Type-Specific Validation**: Uses discriminated schemas to validate different keyboard component types and their specifications.
- **Authentication Middleware**: Protects private routes and validates JWT access tokens.
- **Authorization**: Ensures that users can modify or remove only their own keyboard builds.
- **Rate Limiting**: Includes global, login, and registration rate limiters to protect the API from excessive requests and abuse.
- **Security Headers**: Uses `Helmet` to improve HTTP security.
- **CORS Configuration**: Configures Cross-Origin Resource Sharing for controlled API access.
- **HTTP Logging**: Uses `Pino` and `Pino HTTP` for structured application and request logging.
- **Centralized Error Handling**: Provides consistent API error responses through a dedicated error-handling middleware.
- **API Documentation**: Uses Swagger/OpenAPI to document the available API endpoints.
- **Database Migrations and Seeders**: Uses Sequelize CLI for managing database schema changes and demo data.
- **Health Check**: Provides a `/health` endpoint for monitoring application availability.
- **Graceful Shutdown**: Properly closes the HTTP server and database connection when the application receives shutdown signals.
- **Docker Support**: Includes Docker and Docker Compose configuration for running the API, MySQL database, and Nginx reverse proxy.

## API Structure

The API is organized into versioned REST endpoints:

### Authentication

```text
/api/v1/auth
```

Provides endpoints for:

- User registration
- User login
- User logout
- Refresh token generation
- Password reset

### Parts

```text
/api/v1/parts
```

Provides CRUD operations for mechanical keyboard components:

- Get all parts
- Get a part by ID
- Create parts
- Update a part
- Delete a part

Supported part types:

- **Switch**
- **Case**
- **PCB**
- **Keycap**

### Builds

```text
/api/v1/builds
```

Provides functionality for custom keyboard configurations:

- Get all builds
- Get a build by ID
- Create a build
- Update a build
- Delete a build
- Get builds belonging to the authenticated user

Each build consists of:

- Switch
- Case
- PCB
- Keycaps

## Challenges

Developing the API involved several challenges related to authentication, database design, validation, security, and maintaining a clean backend architecture.

### Key Challenges

- **Authentication System**: Implementing access and refresh token authentication while securely storing refresh tokens in the database.
- **Token Security**: Protecting passwords and refresh tokens with `bcrypt` and validating JWT payloads before processing authenticated requests.
- **Database Relationships**: Designing relationships between users, keyboard parts, builds, and authentication tokens using Sequelize and MySQL.
- **Dynamic Validation**: Creating type-specific validation schemas for switches, cases, PCBs, and keycaps with different specification requirements.
- **Authorization**: Ensuring users can access and modify only the keyboard builds associated with their account.
- **Error Handling**: Creating centralized error handling for validation errors, authentication failures, database errors, and missing resources.
- **Rate Limiting**: Protecting authentication endpoints from brute-force attempts and preventing excessive API requests.
- **Logging**: Implementing structured request and application logging while avoiding exposure of sensitive information.
- **Database Migrations**: Managing database structure changes and providing reproducible seed data through Sequelize migrations and seeders.
- **Production Setup**: Preparing the application for production using Docker, MySQL, Nginx, health checks, and graceful shutdown handling.

These challenges were addressed through modular architecture, middleware-based request processing, validation layers, structured services, and consistent error handling.

## Installation & Setup

To install the project and run it locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/Rostyslav452/mysql_api.git
```

2. Navigate to the project directory:

```bash
cd mysql_api
```

3. Install dependencies:

```bash
npm install
```

4. Create an environment file:

```bash
cp .env.example .env
```

5. Configure the required environment variables in `.env`, including database credentials, JWT secrets, and application configuration.

6. Run database migrations:

```bash
npm run migration
```

7. Seed the database with demo data:

```bash
npm run seed
```

8. Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

## Docker Setup

The project also provides a Docker-based environment with separate services for the application, MySQL database, and Nginx reverse proxy.

Start the application using:

```bash
docker compose up --build
```

The Docker setup includes:

- **Node.js API**
- **MySQL 8**
- **Nginx reverse proxy**
- **Database health checks**
- **Application health checks**
- **Persistent MySQL volume**

The API is exposed through Nginx on:

```text
http://localhost
```

## Available Scripts

- **`npm run dev`** — starts the development server using `tsx`.
- **`npm run build`** — compiles the TypeScript source code.
- **`npm start`** — starts the compiled production server.
- **`npm run migration`** — runs Sequelize database migrations.
- **`npm run undo`** — reverts the last migration.
- **`npm run seed`** — loads demo data into the database.
- **`npm run seed:undo`** — removes seeded demo data.
- **`npm run lint`** — checks the source code with ESLint.
- **`npm run lint:fix`** — automatically fixes ESLint issues where possible.
- **`npm run format`** — checks source formatting with Prettier.
- **`npm run format:fix`** — automatically formats source files.
- **`npm run check-all`** — runs linting and formatting checks.
- **`npm run fix-all`** — applies linting and formatting fixes.

## Technologies Used

- **Node.js** — runtime environment for executing the backend application.
- **Express 5** — framework used to build the RESTful API and handle HTTP requests.
- **TypeScript** — provides static typing and improves code reliability and maintainability.
- **Sequelize** — ORM used for database models, relationships, queries, migrations, and seeders.
- **MySQL** — relational database used to store users, keyboard parts, builds, and refresh tokens.
- **JWT (JSON Web Token)** — used for access-token and refresh-token based authentication.
- **bcrypt** — used for secure password and refresh-token hashing.
- **Zod** — used for runtime request validation and type-safe schemas.
- **Swagger / OpenAPI** — used for API documentation and endpoint exploration.
- **Pino** — used for structured and high-performance application logging.
- **Pino HTTP** — used for HTTP request logging.
- **Express Rate Limit** — used to limit excessive requests and protect sensitive endpoints.
- **Helmet** — used to add security-related HTTP headers.
- **CORS** — used to control cross-origin API requests.
- **Cookie Parser** — used to parse authentication cookies.
- **UUID** — used to generate unique identifiers for database entities.
- **Docker** — used to containerize the application and simplify deployment.
- **Docker Compose** — used to orchestrate the API, MySQL, and Nginx services.
- **Nginx** — used as a reverse proxy in the production container setup.
- **ESLint** — used for code quality and static analysis.
- **Prettier** — used for consistent code formatting.
- **Husky** — used to configure Git hooks for automated code quality checks.
- **lint-staged** — used to run linting and formatting only on staged files.
- **Git / GitHub** — used for version control and repository hosting.

## Architecture

The project follows a modular layered backend structure:

```text
src/
├── config/          # Environment, database, logger, and CORS configuration
├── controllers/     # Request and response handling
├── core/            # Application-level errors
├── middlewares/     # Authentication, validation, logging, rate limiting, errors
├── models/          # Sequelize database models
├── routers/         # API route definitions
├── schemas/         # Zod validation schemas
├── services/        # Business logic
├── types/           # TypeScript types and interfaces
└── utils/           # Shared utility functions
```

This separation keeps the business logic independent from routing and HTTP-specific concerns and makes the application easier to maintain and extend.

## Database

The application uses **MySQL** with **Sequelize ORM**.

### Main Entities

- **Users** — stores user credentials and account information.
- **Parts** — stores mechanical keyboard components and their specifications.
- **Builds** — stores user-created keyboard configurations.
- **Tokens** — stores hashed refresh tokens and their expiration information.

The database structure is managed through Sequelize migrations and populated with demo data through seeders.

## Security

Security is an important part of the API architecture.

The project includes:

- Password hashing with `bcrypt`
- JWT-based authentication
- Refresh-token storage and validation
- Authentication middleware
- User-level authorization
- Global and authentication-specific rate limiting
- Security headers with Helmet
- CORS configuration
- Input validation with Zod
- Sensitive data redaction in logs
- Environment-based configuration for secrets

## Project Goals

The main goals of the project are to practice and demonstrate:

- REST API development
- Backend architecture
- Node.js and Express development
- TypeScript
- Relational database design
- Sequelize ORM
- Authentication and authorization
- JWT access and refresh tokens
- Input validation
- API security
- Logging and error handling
- Database migrations and seeders
- Docker containerization
- API documentation with Swagger/OpenAPI
- Code quality and development tooling
