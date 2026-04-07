import { Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { AdminRoute, ProtectedRoute } from "./routes";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProductEdit from "./pages/AdminProductEdit";
import AdminProducts from "./pages/AdminProducts";
import AdminUserEdit from "./pages/AdminUserEdit";
import AdminUsers from "./pages/AdminUsers";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Order from "./pages/Order";
import Payment from "./pages/Payment";
import PlaceOrder from "./pages/PlaceOrder";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Shipping from "./pages/Shipping";

function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart/:id" element={<Cart />} />
        <Route path="/cart" element={<Cart />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/product/:id/edit" element={<AdminProductEdit />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/user/:id/edit" element={<AdminUserEdit />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
