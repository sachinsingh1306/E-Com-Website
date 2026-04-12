# 🛒 MERN E-Commerce Website

Live Demo:

* 🌐 Home: https://sachinsingh1306.github.io/E-Com-Website/

---

## 📌 Project Overview

This is a full-stack **E-Commerce Web Application** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. The platform allows users to browse products, manage their cart, place orders, and provides an admin panel for product and order management.

---

## 🚀 Features

### 👤 User Features

* User Registration & Login (JWT Authentication)
* Browse Products
* Add to Cart / Remove from Cart
* Place Orders
* Order Tracking with Tracking Number
* Responsive UI

---

### 🔑 Admin Features

* Secure Admin Login (Single Admin Access)
* Add New Products
* Edit Existing Products
* Delete Products
* View Orders
* Order Verification
* Update Order Status with Tracking Number

---

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML5, CSS3, JavaScript
* Axios (API calls)

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Authentication

* JSON Web Tokens (JWT)
* Protected Routes

---

## 📂 Folder Structure

```
E-Com-Website/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   └── App.js
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/sachinsingh1306/E-Com-Website.git
cd E-Com-Website
```

---

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Authentication Flow

* User logs in → JWT token generated
* Token stored in local storage
* Protected routes verify token before access
* Admin routes restricted to admin user only

---

## 📦 API Highlights

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Products

* `GET /api/products`
* `POST /api/products` (Admin)
* `PUT /api/products/:id` (Admin)
* `DELETE /api/products/:id` (Admin)

### Orders

* `POST /api/orders`
* `GET /api/orders` (Admin)
* `PUT /api/orders/:id` (Update status & tracking)

---

## 📸 Future Improvements

* Payment Gateway Integration (Razorpay/Stripe)
* Wishlist Feature
* Product Reviews & Ratings
* Email Notifications
* Advanced Search & Filters

---

## 🤝 Contribution

Feel free to fork this project and submit pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sachin Singh**

---
