import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../services/api";
import Checkout from "./Checkout";
import { clearCart } from "../redux/slices/cartSlice";
import {
  calculateCartTotals,
  formatCurrency,
  getErrorMessage,
} from "../utils/helpers";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, shippingAddress, paymentMethod } = useSelector(
    (state) => state.cart
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    calculateCartTotals(cartItems);

  const placeOrderHandler = async () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!shippingAddress?.address || !paymentMethod) {
      navigate("/shipping");
      return;
    }

    setLoading(true);
    setError("");

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

      dispatch(clearCart());
      navigate(`/order/${data._id}`);
    } catch (error) {
      setError(getErrorMessage(error, "Order failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="content-grid">
      <div className="card card--stack">
        <Checkout step={4} />
        <h1>Place Order</h1>

        {error && <div className="message message--error">{error}</div>}

        <div className="stack">
          <div>
            <h2>Shipping</h2>
            <p>
              {shippingAddress.address}, {shippingAddress.city},{" "}
              {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          <div>
            <h2>Payment</h2>
            <p>{paymentMethod}</p>
          </div>

          <div>
            <h2>Items</h2>
            {cartItems.map((item) => (
              <div key={item.product} className="order-row">
                <span>
                  {item.name} x {item.qty}
                </span>
                <strong>{formatCurrency(item.price * item.qty)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="card card--stack">
        <h2>Summary</h2>
        <p className="summary-row">
          <span>Items</span>
          <strong>{formatCurrency(itemsPrice)}</strong>
        </p>
        <p className="summary-row">
          <span>Shipping</span>
          <strong>{formatCurrency(shippingPrice)}</strong>
        </p>
        <p className="summary-row">
          <span>Tax</span>
          <strong>{formatCurrency(taxPrice)}</strong>
        </p>
        <p className="summary-row summary-row--total">
          <span>Total</span>
          <strong>{formatCurrency(totalPrice)}</strong>
        </p>

        <button
          className="button"
          type="button"
          onClick={placeOrderHandler}
          disabled={loading || cartItems.length === 0}
        >
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </aside>
    </section>
  );
};

export default PlaceOrder;
