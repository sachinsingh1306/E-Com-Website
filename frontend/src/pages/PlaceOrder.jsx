import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress"));
  const paymentMethod = localStorage.getItem("paymentMethod");

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(cart);
  }, []);

  const placeOrderHandler = async () => {
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const taxPrice = itemsPrice * 0.1;
    const shippingPrice = itemsPrice > 1000 ? 0 : 50;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    try {
      const { data } = await API.post("/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      // Clear cart
      localStorage.removeItem("cartItems");

      navigate(`/order/${data._id}`);
    } catch (error) {
      alert("Order failed");
    }
  };

  return (
    <div>
      <h2>Place Order</h2>

      {cartItems.map((item) => (
        <div key={item.product}>
          <p>{item.name} x {item.qty}</p>
        </div>
      ))}

      <button onClick={placeOrderHandler}>Place Order</button>
    </div>
  );
};

export default PlaceOrder;