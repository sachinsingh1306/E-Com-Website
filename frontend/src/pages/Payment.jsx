import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [method, setMethod] = useState("COD");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    localStorage.setItem("paymentMethod", method);
    navigate("/placeorder");
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Payment</h2>

      <label>
        <input
          type="radio"
          value="COD"
          checked
          onChange={(e) => setMethod(e.target.value)}
        />
        Cash on Delivery
      </label>

      <button type="submit">Continue</button>
    </form>
  );
};

export default Payment;