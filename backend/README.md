# Backend README

## Overview
This is the Express and MongoDB backend for the E-Com Website project. It handles authentication, products, reviews, users, and order management for the frontend application.

## Tech Stack
- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication
- bcryptjs for password hashing
- CORS

## Main Features
- User registration and login
- JWT-based protected routes
- Admin-only routes for product, user, and order management
- Product CRUD operations
- Product reviews
- Order creation and order status updates
- Category listing for products

## Project Structure
```text
backend/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
```

## Prerequisites
- Node.js 18 or later
- npm
- MongoDB connection string

## Environment Variables
Create a `.env` file in the `backend` folder.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_SECRET_KEY=your_admin_secret_key
PORT=5000
```

### Variable Details
- `MONGO_URI`: MongoDB Atlas or local MongoDB connection string.
- `JWT_SECRET`: secret used to sign JWT tokens.
- `ADMIN_SECRET_KEY`: secret used for admin-related checks in the app.
- `PORT`: server port. Defaults to `5000` if omitted.

## Installation
```bash
npm install
```

## Start The Server
```bash
npm start
```

Server default URL:
- `http://localhost:5000`

Health check route:
- `GET /` returns `API running...`

## Available Scripts
- `npm start` starts the backend server.
- `npm test` is currently a placeholder and is not implemented.

## API Routes
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Products
- `GET /api/products`
- `POST /api/products` admin only
- `GET /api/products/:id`
- `PUT /api/products/:id` admin only
- `DELETE /api/products/:id` admin only
- `POST /api/products/:id/reviews` authenticated users
- `GET /api/products/categories`

### Users
- `GET /api/users/profile` authenticated user
- `GET /api/users` admin only
- `GET /api/users/:id` admin only
- `PUT /api/users/:id` admin only
- `DELETE /api/users/:id` admin only

### Orders
- `POST /api/orders` authenticated user
- `GET /api/orders` admin only
- `GET /api/orders/myorders` authenticated user
- `GET /api/orders/:id` authenticated user
- `PUT /api/orders/:id/pay` authenticated user
- `PUT /api/orders/:id/deliver` admin only

## Notes
- Database connection is initialized in `config/db.js`.
- Global error handling is set up through the custom middleware in `middleware/errorMiddleware.js`.
- CORS and JSON body parsing are enabled in `server.js`.
- Product updates support multiple extra image URLs through the `images` field.
