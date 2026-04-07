import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Shipping = () => {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    const shippingData = {
      address,
      city,
      postalCode,
      country,
    };

    localStorage.setItem("shippingAddress", JSON.stringify(shippingData));
    navigate("/payment");
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Shipping</h2>

      <input placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
      <input placeholder="City" onChange={(e) => setCity(e.target.value)} />
      <input placeholder="Postal Code" onChange={(e) => setPostalCode(e.target.value)} />
      <input placeholder="Country" onChange={(e) => setCountry(e.target.value)} />

      <button type="submit">Continue</button>
    </form>
  );
};

export default Shipping;