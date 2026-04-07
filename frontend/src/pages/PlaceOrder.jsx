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
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <Checkout step={4} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Place Order
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Review your shipping details, payment method, and items before confirming.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Shipping</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Payment</h2>
              <p className="mt-3 text-sm text-slate-600">{paymentMethod}</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Items</h2>

              <div className="mt-5 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-2xl object-cover border border-slate-200 bg-white"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">
                          Qty: {item.qty}
                        </p>
                      </div>
                    </div>

                    <strong className="text-slate-900">
                      {formatCurrency(item.price * item.qty)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Items</span>
                <strong className="text-slate-900">
                  {formatCurrency(itemsPrice)}
                </strong>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <strong className="text-slate-900">
                  {formatCurrency(shippingPrice)}
                </strong>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Tax</span>
                <strong className="text-slate-900">
                  {formatCurrency(taxPrice)}
                </strong>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-900">Total</span>
                  <strong className="text-2xl font-extrabold text-slate-900">
                    {formatCurrency(totalPrice)}
                  </strong>
                </div>
              </div>
            </div>

            <button
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={placeOrderHandler}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? "Placing order..." : "Place Order"}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default PlaceOrder;
