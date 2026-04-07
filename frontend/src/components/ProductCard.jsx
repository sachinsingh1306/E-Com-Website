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
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        className="block overflow-hidden bg-slate-100"
        to={`/product/${product._id}`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="space-y-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-600">
          {product.category || "Featured product"}
        </p>

        <h3 className="line-clamp-1 text-lg font-bold text-slate-900">
          {product.name}
        </h3>

        <p className="text-2xl font-extrabold text-slate-900">
          {formatCurrency(product.price)}
        </p>

        <p className="text-sm text-slate-500">
          Rating <span className="font-semibold text-amber-500">{product.rating || 0}</span> / 5
          <span className="ml-1">({product.numReviews || 0} reviews)</span>
        </p>

        <button
          className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
