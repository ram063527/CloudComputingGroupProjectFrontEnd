import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catalogApi, ProductShortResponseDTO, PageResultProductShortResponseDTO } from '../api/catalog';
import { ProductCard } from '../components/ProductCard';
import { Filters } from '../components/Filters';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<ProductShortResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageData, setPageData] = useState<PageResultProductShortResponseDTO | null>(null);
  
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [filters, setFilters] = useState<{ genre?: string; minPrice?: number; maxPrice?: number }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const hasFilters = Boolean(
        searchQuery || 
        filters.genre || 
        (filters.minPrice !== undefined && filters.minPrice !== null) || 
        (filters.maxPrice !== undefined && filters.maxPrice !== null)
      );
      
      let data;
      if (hasFilters) {
        data = await catalogApi.searchProducts({
          query: searchQuery || undefined,
          genre: filters.genre,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          page: currentPage,
        });
      } else {
        data = await catalogApi.getAllProducts(currentPage);
      }
      
      setProducts(data.data || []);
      setPageData(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: { genre?: string; minPrice?: number; maxPrice?: number }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  return (
    <main className="mx-auto w-full max-w-7xl flex-grow px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Filters</h2>
            <Filters onFilterChange={handleFilterChange} />
          </div>
        </aside>

        {/* Product Grid */}
        <section className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {searchQuery ? `Search results for "${searchQuery}"` : 'All Books'}
            </h1>
            <span className="text-sm text-gray-500">
              {pageData?.totalElements || 0} results
            </span>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No books found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.code} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pageData && pageData.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={pageData.isFirst}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Page {pageData.pageNumber} of {pageData.totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(pageData.totalPages, p + 1))}
                    disabled={pageData.isLast}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

const BookOpen = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
