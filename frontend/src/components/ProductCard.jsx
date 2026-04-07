import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { formatCurrency } from "../utils/helpers";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = () => {
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: 1,
        countInStock: product.countInStock,
      })
    );
    navigate("/cart");
  };

  return (
    <article className="product-card">
      <Link className="product-card__image" to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} />
      </Link>

      <div className="product-card__body">
        <p className="eyebrow">{product.category || "Featured product"}</p>
        <h3>{product.name}</h3>
        <p className="product-card__price">{formatCurrency(product.price)}</p>
        <p className="muted">
          Rating {product.rating || 0} / 5 ({product.numReviews || 0} reviews)
        </p>

        <button
          className="button"
          type="button"
          onClick={addToCartHandler}
          disabled={product.countInStock === 0}
        >
          {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
