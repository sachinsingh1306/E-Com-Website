import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import API from "../services/api";
import { getErrorMessage } from "../utils/helpers";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");

        if (!ignore) {
          setProducts(data.products || []);
          setError("");
        }
      } catch (error) {
        if (!ignore) {
          setError(getErrorMessage(error, "Unable to load products"));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="page-section">
      <div className="hero">
        <div>
          <p className="eyebrow">Smart shopping flow</p>
          <h1>Find products, manage orders, and test the full stack faster.</h1>
          <p className="muted">
            The storefront and admin screens now share the same cart, auth, and
            checkout flow.
          </p>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading products..." />
      ) : error ? (
        <div className="message message--error">{error}</div>
      ) : products.length === 0 ? (
        <div className="message">No products found yet.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Home;
