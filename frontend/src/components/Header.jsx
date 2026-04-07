import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import { formatCurrency } from "../utils/helpers";
import { ShoppingBag, LogOut, LayoutDashboard, User } from "lucide-react";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-white/10 text-white shadow-inner"
      : "text-slate-300 hover:bg-white/5 hover:text-white"
  }`;

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
    // Changed to a deep slate background with a subtle border
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0f172a] shadow-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 active:scale-95 transition-transform">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-900/20">
            E
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold tracking-tight text-white">
              E-Com Store
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Premium Shop
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          
          {userInfo?.isAdmin && (
            <div className="ml-2 flex items-center gap-1 border-l border-white/10 pl-3">
              <NavLink to="/admin" className={navLinkClass}>
                <LayoutDashboard size={16} /> Admin
              </NavLink>
            </div>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Cart Pill - Dark themed */}
          <Link to="/cart" className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-1.5 pr-4 transition-all hover:bg-white/10 hover:border-white/20">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-[#0f172a]">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden text-right leading-tight lg:block">
              <p className="text-[10px] font-medium text-slate-400">Cart Total</p>
              <p className="text-xs font-bold text-white">{formatCurrency(cartValue)}</p>
            </div>
          </Link>

          {/* User Section */}
          <div className="flex items-center gap-2">
            {userInfo ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/10 border border-white/5"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{userInfo.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logoutHandler}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition active:scale-95"
                >
                  Join Now
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;