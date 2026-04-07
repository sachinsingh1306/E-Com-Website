import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    navigate(`/cart/${product._id}`);
  };

  if (!product) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} width="200" />
      <p>{product.description}</p>
      <h3>₹{product.price}</h3>
      <p>Stock: {product.countInStock}</p>

      <button onClick={addToCartHandler}>
        Add to Cart
      </button>
    </div>
  );
};

export default Product;