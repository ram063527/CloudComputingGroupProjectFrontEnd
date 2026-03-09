import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../auth/CartContext';

interface ProductCardProps {
  product: {
    code: string;
    name: string;
    author: string;
    price: number;
    imageUrl: string;
    status: 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const isAvailable = product.status === 'AVAILABLE';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md">
      <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 sm:aspect-[2/3]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.author}</p>
        <div className="flex flex-1 flex-col justify-end">
          <p className="text-base font-semibold text-gray-900">${product.price.toFixed(2)}</p>
          <button
            onClick={() => addToCart(product.code, 1)}
            disabled={!isAvailable}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isAvailable
                ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                : 'cursor-not-allowed bg-gray-100 text-gray-400'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {isAvailable ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};
