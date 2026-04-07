import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Checkout from "./Checkout";
import { saveShippingAddress } from "../redux/slices/cartSlice";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shippingAddress } = useSelector((state) => state.cart);
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate("/payment");
  };

  return (
    <section className="auth-shell">
      <form className="card auth-card" onSubmit={submitHandler}>
        <Checkout step={2} />
        <h1>Shipping</h1>

        <label className="field">
          <span>Address</span>
          <input
            placeholder="Street address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>City</span>
          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Postal Code</span>
          <input
            placeholder="Postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Country</span>
          <input
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>

        <button className="button" type="submit">
          Continue to Payment
        </button>
      </form>
    </section>
  );
};

export default Shipping;
