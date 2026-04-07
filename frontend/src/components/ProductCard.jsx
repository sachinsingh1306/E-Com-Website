import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div>
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} width="150" />
      </Link>

      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <p>⭐ {product.rating}</p>
    </div>
  );
};

export default ProductCard;