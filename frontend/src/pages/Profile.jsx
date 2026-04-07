import { useEffect, useState } from "react";
import API from "../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: userData } = await API.get("/users/profile");
        const { data: orderData } = await API.get("/orders/myorders");

        setUser(userData);
        setOrders(orderData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!user) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>Profile</h2>

      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>

      <h3>My Orders</h3>

      {orders.length === 0 ? (
        <p>No Orders</p>
      ) : (
        orders.map((order) => (
          <div key={order._id}>
            <p>Order ID: {order._id}</p>
            <p>Total: ₹{order.totalPrice}</p>
            <p>Status: {order.isPaid ? "Paid" : "Pending"}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;