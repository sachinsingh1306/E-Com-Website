import { Link } from "react-router-dom";

const Checkout = ({ step = 1 }) => {
  const steps = [
    { number: 1, label: "Login", path: "/login" },
    { number: 2, label: "Shipping", path: "/shipping" },
    { number: 3, label: "Payment", path: "/payment" },
    { number: 4, label: "Place Order", path: "/placeorder" },
  ];

  return (
    <nav className="checkout-steps" aria-label="Checkout progress">
      {steps.map((item) => (
        <Link
          key={item.number}
          className={`checkout-step ${
            item.number <= step ? "checkout-step--active" : ""
          }`}
          to={item.number <= step ? item.path : "#"}
        >
          <span>{item.number}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Checkout;
