import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import { formatCurrency } from "../utils/helpers";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const cartValue = cartItems.reduce(
    (total, item) => total + item.qty * Number(item.price),
    0
  );

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/">
          E-Com Website
        </Link>

        <nav className="site-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/cart">Cart {cartCount > 0 ? `(${cartCount})` : ""}</NavLink>
          {userInfo?.isAdmin && <NavLink to="/admin">Dashboard</NavLink>}
          {userInfo?.isAdmin && <NavLink to="/admin/products">Products</NavLink>}
          {userInfo?.isAdmin && <NavLink to="/admin/orders">Orders</NavLink>}
          {userInfo?.isAdmin && <NavLink to="/admin/users">Users</NavLink>}
        </nav>

        <div className="site-header__actions">
          <div className="cart-pill">
            <span>{cartCount} items</span>
            <strong>{formatCurrency(cartValue)}</strong>
          </div>

          {userInfo ? (
            <div className="account-menu">
              <NavLink to="/profile">{userInfo.name}</NavLink>
              <button
                className="button button--ghost"
                type="button"
                onClick={logoutHandler}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="account-menu">
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
