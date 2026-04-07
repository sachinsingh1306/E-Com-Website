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

  if (loading) return <Loader message="Loading product..." />;
  if (error) return <div className="message message--error">{error}</div>;
  if (!product) return <div className="message">Product not found.</div>;

  const galleryImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <section className="page-section">
      <div className="detail-grid">
        <div className="card card--stack">
          <img className="product-detail__image" src={selectedImage} alt={product.name} />

          {galleryImages.length > 1 && (
            <div className="product-grid">
              {galleryImages.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  className="button button--ghost"
                  onClick={() => setSelectedImage(img)}
                >
                  Image {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="card card--stack">
          <p className="eyebrow">{product.category || "Product detail"}</p>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p className="product-card__price">{formatCurrency(product.price)}</p>
          <p className="muted">
            Brand: {product.brand || "N/A"} | Rating {product.rating || 0} / 5
          </p>
          <p className="muted">Reviews: {product.numReviews || 0}</p>
          <p className="muted">
            Stock available: {product.countInStock > 0 ? product.countInStock : "Out of stock"}
          </p>

          {product.countInStock > 0 && (
            <label className="field">
              <span>Quantity</span>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {Array.from({ length: product.countInStock }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </label>
          )}

          <button
            className="button"
            type="button"
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
          >
            {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>

      <div className="content-grid">
        <div className="card card--stack">
          <h2>Customer Reviews</h2>

          {product.reviews?.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review._id} className="card card--stack">
                <strong>{review.name}</strong>
                <p className="muted">Rating: {review.rating} / 5</p>
                <p className="muted">{formatDate(review.createdAt)}</p>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="muted">No reviews yet.</p>
          )}
        </div>

        <div className="card card--stack">
          <h2>Write a Review</h2>

          {reviewError && <div className="message message--error">{reviewError}</div>}
          {reviewSuccess && <div className="message">{reviewSuccess}</div>}

          {!userInfo ? (
            <p className="muted">Login to add a rating and review.</p>
          ) : (
            <form className="stack" onSubmit={submitReviewHandler}>
              <label className="field">
                <span>Rating</span>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value={1}>1 - Poor</option>
                  <option value={2}>2 - Fair</option>
                  <option value={3}>3 - Good</option>
                  <option value={4}>4 - Very Good</option>
                  <option value={5}>5 - Excellent</option>
                </select>
              </label>

              <label className="field">
                <span>Comment</span>
                <textarea
                  rows="5"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review"
                  required
                />
              </label>

              <button className="button" type="submit" disabled={reviewLoading}>
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Product;
