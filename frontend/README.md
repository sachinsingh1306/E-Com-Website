# Frontend README

## Overview
This is the React frontend for the E-Com Website project. It provides the customer storefront, cart and checkout flow, profile pages, and the admin dashboard for managing products, orders, and users.

## Tech Stack
- React 19
- React Router
- Redux Toolkit
- Axios
- Vite
- Tailwind CSS 4

## Main Features
- Product listing and product details pages
- Cart flow with quantity updates
- User login and registration
- Protected checkout flow: shipping, payment, place order
- Order details and profile pages
- Admin dashboard for products, orders, and users
- Product editor with support for multiple extra product image URLs

## Project Structure
```text
frontend/
  src/
    components/
    pages/
    redux/
    services/
    utils/
```

## Prerequisites
- Node.js 18 or later
- npm
- Backend API running locally or on a deployed server

## Environment Variables
Create a `src/.env` file if you want to point the frontend to a custom API URL.

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

If this variable is not set, the app defaults to `http://localhost:5000/api`.

## Installation
```bash
npm install
```

## Run In Development
```bash
npm run dev
```

Default Vite dev URL:
- `http://localhost:5173`

## Build For Production
```bash
npm run build
```

## Preview Production Build
```bash
npm run preview
```

## Available Scripts
- `npm run dev` starts the Vite development server.
- `npm run build` creates the production build.
- `npm run preview` previews the production build locally.
- `npm run lint` runs ESLint.

## Main Routes
- `/` home page
- `/product/:id` product details page
- `/login` user login
- `/register` user registration
- `/cart` cart page
- `/shipping` shipping step
- `/payment` payment step
- `/placeorder` order review and placement
- `/profile` user profile
- `/admin` admin dashboard
- `/admin/products` admin product management
- `/admin/orders` admin order management
- `/admin/users` admin user management

## API Integration
Axios is configured in `src/services/api.js` and automatically attaches the saved JWT token to authenticated requests.

## Notes
- Make sure the backend server is running before using auth, products, or checkout flows.
- Admin pages require a logged-in user with admin access.
