import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import API from "../services/api";
import { getErrorMessage } from "../utils/helpers";

const normalizeExtraImages = (images = []) =>
  images
    .flatMap((image) =>
      typeof image === "string" ? image.split(/[\r\n,]+/) : []
    )
    .map((image) => image.trim())
    .filter(Boolean);

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

  const [extraImages, setExtraImages] = useState([""]);
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
        setExtraImages(data.images?.length ? data.images : [""]);
        setError("");
      } catch (error) {
        setError(getErrorMessage(error, "Unable to load product"));
      } finally {
        setLoading(false);
      }
    };

    void fetchProduct();
  }, [id]);

  const updateExtraImage = (index, value) => {
    setExtraImages((currentImages) =>
      currentImages.map((image, imageIndex) =>
        imageIndex === index ? value : image
      )
    );
  };

  const addExtraImageField = () => {
    setExtraImages((currentImages) => [...currentImages, ""]);
  };

  const removeExtraImageField = (index) => {
    setExtraImages((currentImages) => {
      if (currentImages.length === 1) {
        return [""];
      }

      return currentImages.filter((_, imageIndex) => imageIndex !== index);
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await API.put(`/products/${id}`, {
        ...product,
        price: Number(product.price),
        countInStock: Number(product.countInStock),
        images: normalizeExtraImages(extraImages),
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

  const previewImages = [product.image, ...normalizeExtraImages(extraImages)].filter(
    Boolean
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Admin
          </p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900">
            Edit Product
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Update pricing, stock, details, and multiple product images.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <form
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            onSubmit={submitHandler}
          >
            <div className="grid gap-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Name
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Price
                </span>
                <input
                  type="number"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Main Image URL
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  value={product.image}
                  onChange={(e) =>
                    setProduct({ ...product, image: e.target.value })
                  }
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Extra Image URLs
                </span>
                <div className="grid gap-3">
                  {extraImages.map((image, index) => (
                    <div key={`extra-image-${index}`} className="flex gap-3">
                      <input
                        className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                        value={image}
                        onChange={(e) => updateExtraImage(index, e.target.value)}
                        placeholder={`Extra image URL ${index + 1}`}
                      />

                      <button
                        className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                        type="button"
                        onClick={() => removeExtraImageField(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <p className="text-xs text-slate-500">
                    Add one URL per field. You can also paste multiple URLs
                    separated by commas or new lines.
                  </p>

                  <button
                    className="w-fit rounded-2xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
                    type="button"
                    onClick={addExtraImageField}
                  >
                    Add Another Image
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Brand
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  value={product.brand}
                  onChange={(e) =>
                    setProduct({ ...product, brand: e.target.value })
                  }
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  value={product.category}
                  onChange={(e) =>
                    setProduct({ ...product, category: e.target.value })
                  }
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Stock
                </span>
                <input
                  type="number"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  value={product.countInStock}
                  onChange={(e) =>
                    setProduct({ ...product, countInStock: e.target.value })
                  }
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </span>
                <textarea
                  rows="5"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                  required
                />
              </label>

              <button
                className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Update Product"}
              </button>
            </div>
          </form>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              Image Preview
            </h2>

            {previewImages.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {previewImages.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="h-56 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                Add image URLs to preview product images here.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminProductEdit;
