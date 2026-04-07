import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Checkout from "./Checkout";
import { savePaymentMethod } from "../redux/slices/cartSlice";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { paymentMethod } = useSelector((state) => state.cart);
  const [method, setMethod] = useState(paymentMethod || "COD");

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(method));
    navigate("/placeorder");
  };

  return (
    <section className="auth-shell">
      <form className="card auth-card" onSubmit={submitHandler}>
        <Checkout step={3} />
        <h1>Payment</h1>

        <label className="radio-field">
          <input
            type="radio"
            value="COD"
            checked={method === "COD"}
            onChange={(e) => setMethod(e.target.value)}
          />
          Cash on Delivery
        </label>

        <label className="radio-field">
          <input
            type="radio"
            value="ONLINE"
            checked={method === "ONLINE"}
            onChange={(e) => setMethod(e.target.value)}
          />
          Online Payment
        </label>

        <button className="button" type="submit">
          Review Order
        </button>
      </form>
    </section>
  );
};

export default Payment;
