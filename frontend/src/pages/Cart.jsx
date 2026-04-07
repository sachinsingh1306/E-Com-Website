import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import {
  addToCart,
  removeFromCart,
  updateCartItemQty,
} from "../redux/slices/cartSlice";
import API from "../services/api";
import {
  calculateCartTotals,
  formatCurrency,
  getErrorMessage,
} from "../utils/helpers";

const Cart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let ignore = false;

    const addItem = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);

        if (!ignore) {
          dispatch(
            addToCart({
              product: data._id,
              name: data.name,
              image: data.image,
              price: data.price,
              qty: 1,
              countInStock: data.countInStock,
            })
          );
          setError("");
        }
      } catch (error) {
        if (!ignore) {
          setError(getErrorMessage(error, "Unable to add item to cart"));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void addItem();

    return () => {
      ignore = true;
    };
  }, [dispatch, id]);

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    calculateCartTotals(cartItems);

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Cart
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
            Shopping Cart
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Review your selected items before checkout.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {loading ? (
              <Loader message="Updating cart..." />
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            ) : cartItems.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 text-center">
                <p className="text-lg font-semibold text-slate-800">
                  Your cart is empty
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Start shopping and add products to your cart.
                </p>
                <Link
                  to="/"
                  className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {cartItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-24 rounded-2xl object-cover border border-slate-200 bg-white"
                      />

                      <div>
                        <Link
                          to={`/product/${item.product}`}
                          className="text-lg font-bold text-slate-900 hover:text-sky-600"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            updateCartItemQty({
                              productId: item.product,
                              qty: Number(e.target.value),
                            })
                          )
                        }
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                      >
                        {Array.from({ length: item.countInStock }, (_, index) => (
                          <option key={index + 1} value={index + 1}>
                            Qty: {index + 1}
                          </option>
                        ))}
                      </select>

                      <button
                        className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        type="button"
                        onClick={() => dispatch(removeFromCart(item.product))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Items</span>
                <strong className="text-slate-900">{formatCurrency(itemsPrice)}</strong>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <strong className="text-slate-900">{formatCurrency(shippingPrice)}</strong>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Tax</span>
                <strong className="text-slate-900">{formatCurrency(taxPrice)}</strong>
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
              onClick={() => navigate("/shipping")}
              disabled={cartItems.length === 0}
            >
              Proceed to Shipping
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Cart;
