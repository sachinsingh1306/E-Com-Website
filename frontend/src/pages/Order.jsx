import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data);
    };

    fetchOrder();
  }, [id]);

  if (!order) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>Order Details</h2>
      <p>Total: ₹{order.totalPrice}</p>
      <p>Status: {order.isPaid ? "Paid" : "Pending"}</p>
    </div>
  );
};

export default Order;