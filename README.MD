# Farm Cafe "Mobila" - Backend

## Mobila Cafe Management System - Backend

This is the backend application for the Mobila Cafe Management System, created using Node.js, Express, and MongoDB. It provides an API for managing restaurant data and interacting with the frontend application.

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure MongoDB connection in the `config.js` file.
4. Start the server: `npm start:dev`
5. The server will run at `http://localhost:3000`

## Available APIs

- `/api/tables`: Manage restaurant tables (CRUD operations)
- `/api/waiters`: Manage waitstaff (CRUD operations)
- `/api/dishes`: Manage dishes (CRUD operations)
- `/api/shifts`: Manage shifts (CRUD operations)
- `/api/orders`: Manage orders (CRUD operations)

## Testing

- Run tests to ensure the correct functioning of the application.

```bash
npm test
