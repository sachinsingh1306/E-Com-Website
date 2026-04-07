import { Link } from "react-router-dom";

const Checkout = ({ step = 1 }) => {
  const steps = [
    { number: 1, label: "Login", path: "/login" },
    { number: 2, label: "Shipping", path: "/shipping" },
    { number: 3, label: "Payment", path: "/payment" },
    { number: 4, label: "Place Order", path: "/placeorder" },
  ];

  return (
    <nav
      className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Checkout progress"
    >
      {steps.map((item) => {
        const isActive = item.number <= step;
        const isCurrent = item.number === step;

        return (
          <Link
            key={item.number}
            to={isActive ? item.path : "#"}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              isCurrent
                ? "border-sky-500 bg-sky-500 text-white shadow-md"
                : isActive
                ? "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
                : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
            }`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                isCurrent
                  ? "bg-white text-sky-600"
                  : isActive
                  ? "bg-sky-500 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {item.number}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Checkout;
