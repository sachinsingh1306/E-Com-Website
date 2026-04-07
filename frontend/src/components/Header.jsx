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
    <header className="bg-blue shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 tracking-wide"
        >
          E-Com
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6 text-gray-700 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-500"
            }
          >
            Cart {cartCount > 0 && `(${cartCount})`}
          </NavLink>

          {userInfo?.isAdmin && (
            <NavLink
              to="/admin/products"
              className="hover:text-blue-500"
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          
          {/* Cart Summary */}
          <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
            <p className="text-gray-600">{cartCount} items</p>
            <p className="font-semibold text-gray-800">
              {formatCurrency(cartValue)}
            </p>
          </div>

          {/* User */}
          {userInfo ? (
            <div className="flex items-center gap-4">
              <NavLink
                to="/profile"
                className="font-medium text-gray-700 hover:text-blue-500"
              >
                {userInfo.name}
              </NavLink>

              <button
                onClick={logoutHandler}
                className="px-4 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <NavLink
                to="/login"
                className="text-gray-700 hover:text-blue-500"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;