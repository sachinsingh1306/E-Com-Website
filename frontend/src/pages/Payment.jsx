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
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Checkout step={3} />

        <form
          className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          onSubmit={submitHandler}
        >
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Checkout
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
              Payment Method
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Choose how you would like to pay for your order.
            </p>
          </div>

          <div className="grid gap-4">
            <label
              className={`cursor-pointer rounded-2xl border p-5 transition ${
                method === "COD"
                  ? "border-sky-500 bg-sky-50 ring-2 ring-sky-200"
                  : "border-slate-200 bg-white hover:border-sky-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  value="COD"
                  checked={method === "COD"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="mt-1 h-4 w-4 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    Cash on Delivery
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Pay when your order arrives at your doorstep.
                  </p>
                </div>
              </div>
            </label>

            <label
              className={`cursor-pointer rounded-2xl border p-5 transition ${
                method === "ONLINE"
                  ? "border-sky-500 bg-sky-50 ring-2 ring-sky-200"
                  : "border-slate-200 bg-white hover:border-sky-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  value="ONLINE"
                  checked={method === "ONLINE"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="mt-1 h-4 w-4 text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <p className="text-lg font-bold text-slate-900">
                    Online Payment
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Continue with secure online payment during checkout.
                  </p>
                </div>
              </div>
            </label>
          </div>

          <button
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
            type="submit"
          >
            Review Order
          </button>
        </form>
      </div>
    </section>
  );
};

export default Payment;
