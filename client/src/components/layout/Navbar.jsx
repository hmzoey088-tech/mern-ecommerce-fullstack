import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice.js';
import { toggleDarkMode } from '../../store/uiSlice.js';

const Navbar = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items.length);
  const darkMode = useSelector((state) => state.ui.darkMode);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link className="text-xl font-bold tracking-tight text-slate-900 dark:text-white" to="/">NexaShop</Link>
        <div className="flex items-center gap-4">
          <Link className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300" to="/shop">Shop</Link>
          <Link className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300" to="/cart">Cart</Link>
          {auth.user ? (
            <>
              <Link className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300" to="/account">Account</Link>
              {auth.user.role === 'admin' && (
                <Link className="text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300" to="/admin">Admin</Link>
              )}
              <button onClick={handleLogout} className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">Logout</button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link className="rounded border border-slate-900 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 dark:border-slate-100 dark:text-slate-100" to="/login">Login</Link>
              <Link className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700" to="/register">Register</Link>
            </div>
          )}
          <button
            type="button"
            onClick={() => dispatch(toggleDarkMode())}
            className="rounded-full border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
          <Link className="relative text-slate-700 hover:text-slate-900 dark:text-slate-300" to="/cart">
            <span className="text-sm">🛒</span>
            {cartItems > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-semibold text-white">{cartItems}</span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
