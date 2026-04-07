import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import API from "../services/api";
import { formatCurrency, getErrorMessage } from "../utils/helpers";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const refreshProducts = async () => {
    const { data } = await API.get("/products");
    setProducts(data.products || []);
  };

  const createProductHandler = async () => {
    setSubmitting(true);
    setError("");

    try {
      const { data } = await API.post("/products", {
        name: "New Product",
        price: 0,
        description: "Description",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
        brand: "New Brand",
        category: "General",
        countInStock: 0,
      });

      navigate(`/admin/product/${data.product._id}/edit`);
    } catch (error) {
      setError(getErrorMessage(error, "Unable to create product"));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await API.delete(`/products/${id}`);
      await refreshProducts();
    } catch (error) {
      setError(getErrorMessage(error, "Unable to delete product"));
    }
  };

  return (
    <section className="page-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Manage Products</h1>
        </div>

        <button
          className="button"
          type="button"
          onClick={createProductHandler}
          disabled={submitting}
        >
          {submitting ? "Creating..." : "Create Product"}
        </button>
      </div>

      {error && <div className="message message--error">{error}</div>}

      {loading ? (
        <Loader message="Loading admin products..." />
      ) : (
        <div className="stack">
          {products.map((product) => (
            <div key={product._id} className="order-row">
              <div>
                <p>{product.name}</p>
                <p className="muted">{formatCurrency(product.price)}</p>
              </div>

              <div className="inline-actions">
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                >
                  Edit
                </button>

                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => deleteHandler(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminProducts;
