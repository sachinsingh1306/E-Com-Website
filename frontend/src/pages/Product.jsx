import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { addToCart } from "../redux/slices/cartSlice";
import API from "../services/api";
import { formatCurrency, formatDate, getErrorMessage } from "../utils/helpers";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
      setSelectedImage(data.image);
      setQty(data.countInStock > 0 ? 1 : 0);
      setError("");
    } catch (error) {
      setError(getErrorMessage(error, "Unable to load product"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
        countInStock: product.countInStock,
      })
    );
    navigate("/cart");
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      await API.post(`/products/${id}/reviews`, {
        rating,
        comment,
      });

      setReviewSuccess("Review added successfully.");
      setComment("");
      setRating(5);
      await fetchProduct();
    } catch (error) {
      setReviewError(getErrorMessage(error, "Unable to submit review"));
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading product..." />;
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center text-slate-600 shadow-sm">
          Product not found.
        </div>
      </section>
    );
  }

  const galleryImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              <img
                className="h-[450px] w-full object-cover"
                src={selectedImage}
                alt={product.name}
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {galleryImages.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`overflow-hidden rounded-2xl border transition ${
                      selectedImage === img
                        ? "border-sky-500 ring-2 ring-sky-200"
                        : "border-slate-200 hover:border-sky-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="h-24 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              {product.category || "Product"}
            </p>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
              {product.name}
            </h1>

            <p className="mt-4 text-lg leading-7 text-slate-600">
              {product.description}
            </p>

            <p className="mt-6 text-3xl font-extrabold text-slate-900">
              {formatCurrency(product.price)}
            </p>

            <div className="mt-5 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-semibold text-slate-900">Brand:</span>{" "}
                {product.brand || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Rating:</span>{" "}
                {product.rating || 0} / 5
              </p>
              <p>
                <span className="font-semibold text-slate-900">Reviews:</span>{" "}
                {product.numReviews || 0}
              </p>
            </div>

            <div className="mt-5">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  product.countInStock > 0
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.countInStock > 0
                  ? `${product.countInStock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="mt-6">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Quantity
                  </span>
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  >
                    {Array.from({ length: product.countInStock }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            <button
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
            >
              {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>

            <div className="mt-5 space-y-4">
              {product.reviews?.length > 0 ? (
                product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">{review.name}</strong>
                      <span className="text-sm font-semibold text-amber-500">
                        {review.rating} / 5
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(review.createdAt)}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No reviews yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">Write a Review</h2>

            {reviewError && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {reviewError}
              </div>
            )}

            {reviewSuccess && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
                {reviewSuccess}
              </div>
            )}

            {!userInfo ? (
              <p className="mt-5 text-sm text-slate-500">
                Login to add a rating and review.
              </p>
            ) : (
              <form className="mt-5 grid gap-5" onSubmit={submitReviewHandler}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Rating
                  </span>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  >
                    <option value={1}>1 - Poor</option>
                    <option value={2}>2 - Fair</option>
                    <option value={3}>3 - Good</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={5}>5 - Excellent</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Comment
                  </span>
                  <textarea
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review"
                    required
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  />
                </label>

                <button
                  className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  type="submit"
                  disabled={reviewLoading}
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
