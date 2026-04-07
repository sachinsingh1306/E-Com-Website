import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { userInfo } = useSelector((state) => state.userLogin);

  return (
    <div>
      <h2>Header</h2>

      {userInfo && userInfo.isAdmin && (
        <>
          <Link to="/admin/products">Admin Products</Link> |{" "}
        </>
      )}

      <Link to="/">Home</Link> |{" "}
      <Link to="/cart">Cart</Link> |{" "}

      {userInfo ? (
        <>
          <Link to="/profile">Profile</Link> |{" "}
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
};

export default Header;