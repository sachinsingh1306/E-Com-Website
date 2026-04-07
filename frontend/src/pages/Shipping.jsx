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
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Checkout step={2} />

        <form
          className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
          onSubmit={submitHandler}
        >
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Checkout
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
              Shipping Address
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your delivery details to continue to payment.
            </p>
          </div>

          <div className="grid gap-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Address
              </span>
              <input
                placeholder="Street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                City
              </span>
              <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Postal Code
                </span>
                <input
                  placeholder="Postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Country
                </span>
                <input
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </label>
            </div>

            <button
              className="mt-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
              type="submit"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Shipping;
