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
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Admin
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
              Manage Products
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Create, edit, and delete products with full catalog control.
            </p>
          </div>

          <button
            className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={createProductHandler}
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Product"}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <Loader message="Loading admin products..." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
                      {product.category || "General"}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      {product.name}
                    </h2>
                    <p className="mt-2 text-lg font-extrabold text-slate-800">
                      {formatCurrency(product.price)}
                    </p>
                  </div>

                  <div className="space-y-1 text-sm text-slate-500">
                    <p>Brand: {product.brand || "N/A"}</p>
                    <p>Stock: {product.countInStock}</p>
                    <p className="break-all">ID: {product._id}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      type="button"
                      onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                    >
                      Edit
                    </button>

                    <button
                      className="flex-1 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      type="button"
                      onClick={() => deleteHandler(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminProducts;
