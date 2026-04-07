import { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import { getErrorMessage } from "../utils/helpers";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data.products || []);
        setError("");
      } catch (error) {
        setError(getErrorMessage(error, "Unable to load products"));
      } finally {
        setLoading(false);
      }
    };

    void fetchProducts();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 px-8 py-12 text-white shadow-xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">
            Welcome to E-Com
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Discover Products You'll Love
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-sky-100 sm:text-base">
            Shop top-quality products, explore reviews, and enjoy a smooth
            shopping experience with delivery tracking and secure checkout.
          </p>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Products
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Featured Collection
            </h2>
          </div>
        </div>

        {loading ? (
          <Loader message="Loading products..." />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-800">
              No products found
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Please add products from the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Home;
