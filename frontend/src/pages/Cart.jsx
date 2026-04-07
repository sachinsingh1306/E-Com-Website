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
    <section className="content-grid">
      <div className="card card--stack">
        <h1>Shopping Cart</h1>

        {loading ? (
          <Loader message="Updating cart..." />
        ) : error ? (
          <div className="message message--error">{error}</div>
        ) : cartItems.length === 0 ? (
          <div className="message">
            Cart is empty. <Link to="/">Browse products</Link>
          </div>
        ) : (
          <div className="stack">
            {cartItems.map((item) => (
              <div key={item.product} className="cart-row">
                <img src={item.image} alt={item.name} />

                <div className="cart-row__info">
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                  <p className="muted">{formatCurrency(item.price)}</p>
                </div>

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
                >
                  {Array.from({ length: item.countInStock }, (_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>

                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => dispatch(removeFromCart(item.product))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="card card--stack">
        <h2>Order Summary</h2>
        <p className="summary-row">
          <span>Items</span>
          <strong>{formatCurrency(itemsPrice)}</strong>
        </p>
        <p className="summary-row">
          <span>Shipping</span>
          <strong>{formatCurrency(shippingPrice)}</strong>
        </p>
        <p className="summary-row">
          <span>Tax</span>
          <strong>{formatCurrency(taxPrice)}</strong>
        </p>
        <p className="summary-row summary-row--total">
          <span>Total</span>
          <strong>{formatCurrency(totalPrice)}</strong>
        </p>

        <button
          className="button"
          type="button"
          onClick={() => navigate("/shipping")}
          disabled={cartItems.length === 0}
        >
          Proceed to Shipping
        </button>
      </aside>
    </section>
  );
};

export default Cart;
