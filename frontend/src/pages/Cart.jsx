import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const Cart = () => {
  const { id } = useParams();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const addItem = async () => {
      if (id) {
        const { data } = await API.get(`/products/${id}`);

        const item = {
          product: data._id,
          name: data.name,
          image: data.image,
          price: data.price,
          qty: 1,
          countInStock: data.countInStock,
        };

        let cart = JSON.parse(localStorage.getItem("cartItems")) || [];

        const existItem = cart.find((x) => x.product === item.product);

        if (existItem) {
          cart = cart.map((x) =>
            x.product === existItem.product ? item : x
          );
        } else {
          cart.push(item);
        }

        localStorage.setItem("cartItems", JSON.stringify(cart));
        setCartItems(cart);
      } else {
        const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartItems(cart);
      }
    };

    addItem();
  }, [id]);

  const removeHandler = (id) => {
    const updatedCart = cartItems.filter((x) => x.product !== id);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  return (
    <div>
      <h2>Cart</h2>

      {cartItems.length === 0 ? (
        <h3>Cart is empty</h3>
      ) : (
        cartItems.map((item) => (
          <div key={item.product}>
            <h3>{item.name}</h3>
            <img src={item.image} width="100" />
            <p>₹{item.price}</p>
            <p>Qty: {item.qty}</p>

            <button onClick={() => removeHandler(item.product)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;