import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, LogIn, LogOut, Search, BookOpen } from 'lucide-react';
import { useKeycloak } from '../auth/KeycloakContext';
import { useCart } from '../auth/CartContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { authenticated, login, logout, profile } = useKeycloak();
  const { cart, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-bold tracking-tight text-gray-900">Bookstore</span>
        </Link>

        <div className="flex flex-1 items-center justify-center px-8">
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full rounded-full border-0 py-2 pl-10 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Search books by title, author, or ISBN..."
            />
          </form>
        </div>

        <div className="flex items-center gap-4">
          {authenticated ? (
            <>
              <div className="group relative flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  <User className="h-4 w-4" />
                </div>
                <div className="absolute top-full mt-2 hidden group-hover:block whitespace-nowrap rounded-md bg-gray-800 px-3 py-1.5 text-xs text-white shadow-lg">
                  {profile?.firstName || profile?.username || 'User'}
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => login()}
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
