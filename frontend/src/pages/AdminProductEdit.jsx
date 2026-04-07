import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: 0,
    description: "",
    image: "",
    brand: "",
    category: "",
    countInStock: 0,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    };

    fetchProduct();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();

    await API.put(`/products/${id}`, product);

    alert("Product Updated");
    navigate("/admin/products");
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Edit Product</h2>

      <input
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
        placeholder="Name"
      />

      <input
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
        placeholder="Price"
      />

      <input
        value={product.image}
        onChange={(e) => setProduct({ ...product, image: e.target.value })}
        placeholder="Image URL"
      />

      <input
        value={product.brand}
        onChange={(e) => setProduct({ ...product, brand: e.target.value })}
        placeholder="Brand"
      />

      <input
        value={product.category}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
        placeholder="Category"
      />

      <input
        value={product.countInStock}
        onChange={(e) =>
          setProduct({ ...product, countInStock: e.target.value })
        }
        placeholder="Stock"
      />

      <textarea
        value={product.description}
        onChange={(e) =>
          setProduct({ ...product, description: e.target.value })
        }
        placeholder="Description"
      />

      <button type="submit">Update</button>
    </form>
  );
};

export default AdminProductEdit;