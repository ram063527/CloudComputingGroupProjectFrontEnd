import React from 'react';

interface FiltersProps {
  onFilterChange: (filters: { genre?: string; minPrice?: number; maxPrice?: number }) => void;
}

export const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Biography', 'History'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Genre</h3>
        <ul className="mt-4 space-y-3">
          {genres.map((genre) => (
            <li key={genre} className="flex items-center">
              <input
                id={`genre-${genre}`}
                name="genre"
                type="radio"
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                onChange={() => onFilterChange({ genre })}
              />
              <label htmlFor={`genre-${genre}`} className="ml-3 text-sm text-gray-600">
                {genre}
              </label>
            </li>
          ))}
          <li className="flex items-center">
            <input
              id="genre-all"
              name="genre"
              type="radio"
              defaultChecked
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              onChange={() => onFilterChange({ genre: undefined })}
            />
            <label htmlFor="genre-all" className="ml-3 text-sm text-gray-600">
              All Genres
            </label>
          </li>
        </ul>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="min-price" className="sr-only">Min Price</label>
            <input
              type="number"
              id="min-price"
              placeholder="Min"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
          <div>
            <label htmlFor="max-price" className="sr-only">Max Price</label>
            <input
              type="number"
              id="max-price"
              placeholder="Max"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
