import React from 'react';
import { Link } from 'react-router-dom';

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
  const isAvailable = product.status === 'AVAILABLE';

  return (
    <Link to={`/book/${product.code}`} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md">
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
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.author}</p>
        <div className="flex flex-1 flex-col justify-end mt-2">
          <div className="flex items-center justify-between">
            <p className="text-base font-semibold text-gray-900">${product.price.toFixed(2)}</p>
            {!isAvailable && (
              <span className="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase tracking-wider">Out of Stock</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
