import React from 'react';
import { useCart } from '../auth/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();

  if (loading && !cart) {
    return <div className="p-8 text-center">Loading cart...</div>;
  }

  return (
    <main className="mx-auto w-full max-w-7xl flex-grow px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingBag className="h-8 w-8 text-indigo-600" />
        Your Shopping Cart
      </h1>

      {(!cart || !cart.items || cart.items.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-500">Looks like you haven't added any books yet.</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
              <ul role="list" className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex p-6 sm:p-8">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                       <BookIcon className="h-8 w-8 text-gray-400" />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3 className="line-clamp-2 text-lg"><Link to={`/book/${item.productCode}`}>{item.productName}</Link></h3>
                        <p className="ml-4 text-lg font-semibold">£{item.subTotal.toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Unit Price: £{item.unitPrice.toFixed(2)}</p>
                      
                      <div className="mt-4 flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-300 rounded-md bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-gray-900 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="font-medium text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-2 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="bg-gray-50 px-6 py-4 sm:px-8 border-t border-gray-200 flex justify-end">
                <button 
                  onClick={clearCart}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Clear Cart
                </button>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="flow-root">
                <dl className="-my-4 divide-y divide-gray-200 text-sm">
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-gray-600">Subtotal ({cart.totalItems} items)</dt>
                    <dd className="font-medium text-gray-900">£{cart.totalPrice.toFixed(2)}</dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-gray-600">Shipping</dt>
                    <dd className="font-medium text-gray-900">Calculated at checkout</dd>
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <dt className="text-base font-bold text-gray-900">Total</dt>
                    <dd className="text-base font-bold text-indigo-600">£{cart.totalPrice.toFixed(2)}</dd>
                  </div>
                </dl>
              </div>
              <button className="mt-6 w-full rounded-full bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

const BookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);
