import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import API from "../services/api";
import { getErrorMessage } from "../utils/helpers";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
    images: [],
    brand: "",
    category: "",
    countInStock: 0,
  });
  const [extraImagesText, setExtraImagesText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct({
          ...data,
          images: data.images || [],
        });
        setExtraImagesText((data.images || []).join("\n"));
        setError("");
      } catch (error) {
        setError(getErrorMessage(error, "Unable to load product"));
      } finally {
        setLoading(false);
      }
    };

    void fetchProduct();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await API.put(`/products/${id}`, {
        ...product,
        price: Number(product.price),
        countInStock: Number(product.countInStock),
        images: extraImagesText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
      });

      navigate("/admin/products");
    } catch (error) {
      setError(getErrorMessage(error, "Unable to update product"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader message="Loading product editor..." />;
  }

  return (
    <section className="auth-shell">
      <form className="card auth-card" onSubmit={submitHandler}>
        <h1>Edit Product</h1>

        {error && <div className="message message--error">{error}</div>}

        <label className="field">
          <span>Name</span>
          <input
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span>Price</span>
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span>Main Image URL</span>
          <input
            value={product.image}
            onChange={(e) => setProduct({ ...product, image: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span>Extra Image URLs</span>
          <textarea
            rows="6"
            value={extraImagesText}
            onChange={(e) => setExtraImagesText(e.target.value)}
            placeholder={"One image URL per line"}
          />
        </label>

        <label className="field">
          <span>Brand</span>
          <input
            value={product.brand}
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
          />
        </label>

        <label className="field">
          <span>Category</span>
          <input
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            required
          />
        </label>

        <label className="field">
          <span>Stock</span>
          <input
            type="number"
            value={product.countInStock}
            onChange={(e) =>
              setProduct({ ...product, countInStock: e.target.value })
            }
            required
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            rows="5"
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            required
          />
        </label>

        <button className="button" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Product"}
        </button>
      </form>
    </section>
  );
};

export default AdminProductEdit;
