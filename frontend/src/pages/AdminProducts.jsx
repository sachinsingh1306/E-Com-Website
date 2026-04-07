import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const { data } = await API.get("/products");
    setProducts(data.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ➕ Create
  const createProductHandler = async () => {
    const { data } = await API.post("/products", {
      name: "New Product",
      price: 0,
      description: "Description",
      image: "/img.jpg",
      category: "General",
      countInStock: 0,
    });

    navigate(`/admin/product/${data.product._id}/edit`);
  };

  // ❌ Delete
  const deleteHandler = async (id) => {
    if (window.confirm("Delete this product?")) {
      await API.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div>
      <h2>Admin Products</h2>

      <button onClick={createProductHandler}>+ Create Product</button>

      {products.map((p) => (
        <div key={p._id}>
          <p>{p.name}</p>

          <button onClick={() => navigate(`/admin/product/${p._id}/edit`)}>
            Edit
          </button>

          <button onClick={() => deleteHandler(p._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminProducts;