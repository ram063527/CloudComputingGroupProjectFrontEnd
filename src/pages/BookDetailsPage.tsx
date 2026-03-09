import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { catalogApi, ProductDetailedResponseDTO } from '../api/catalog';
import { useCart } from '../auth/CartContext';
import { ShoppingCart, ArrowLeft, Loader2 } from 'lucide-react';

export const BookDetailsPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductDetailedResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { initialized } = useKeycloak();

  useEffect(() => {
    if (initialized && code) {
      catalogApi.getProductByCode(code)
        .then(setProduct)
        .catch(err => {
          console.error(err);
          setError('Failed to load book details.');
        })
        .finally(() => setLoading(false));
    }
  }, [code, initialized]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-8 text-center text-red-600">
        {error || 'Book not found'}
      </div>
    );
  }

  const isAvailable = product.status === 'AVAILABLE';

  return (
    <main className="mx-auto w-full max-w-7xl flex-grow px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </button>
      
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 bg-white p-6 sm:p-8 rounded-3xl shadow-sm ring-1 ring-gray-200">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="aspect-[2/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-md">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="h-full w-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-1 flex-col">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{product.name}</h1>
          <p className="mt-2 text-xl text-gray-500">by {product.author}</p>
          
          <div className="mt-6 flex items-center gap-4">
            <p className="text-3xl font-bold text-gray-900">£{product.price.toFixed(2)}</p>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {isAvailable ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => addToCart(product.code, 1)}
              disabled={!isAvailable}
              className={`flex w-full md:w-auto items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-medium transition-colors ${
                isAvailable
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                  : 'cursor-not-allowed bg-gray-100 text-gray-400'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              {isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
          
          <div className="mt-10 border-t border-gray-200 pt-8">
            <h3 className="text-lg font-medium text-gray-900">Description</h3>
            <div className="mt-4 prose prose-sm text-gray-600">
              <p>{product.description || 'No description available.'}</p>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-200 pt-8">
            <div>
              <h4 className="text-sm font-medium text-gray-500">ISBN</h4>
              <p className="mt-1 text-sm text-gray-900">{product.isbn || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Genre</h4>
              <p className="mt-1 text-sm text-gray-900">{product.genre || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Publisher</h4>
              <p className="mt-1 text-sm text-gray-900">{product.publisher || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Publication Year</h4>
              <p className="mt-1 text-sm text-gray-900">{product.publicationYear || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
