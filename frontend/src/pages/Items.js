import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import placeholderProduct from '../assets/images/placeholder-product.jpg';

function Items() {
  const { items, fetchItems } = useData();
  const abortControllerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadItems = async () => {
      // Avoid duplicate requests if already loading or if items exist
      if (isLoading || items.length > 0) {
        return;
      }

      try {
        setIsLoading(true);
        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();
        await fetchItems(abortControllerRef.current.signal);
      } catch (error) {
        // Don't log errors for aborted requests
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadItems();

    // Cleanup function to abort request if component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [items.length, fetchItems, isLoading]); // Proper dependencies

  if (!items.length) return (
    <div className="flex justify-center items-center py-8">
      <p className="text-gray-600">Loading...</p>
    </div>
  );
  
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending products</h2>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
          {items.map((item, index) => {
            
            return(
            <div key={item.id} className="group relative">
              <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                <img alt={""} src={placeholderProduct} className="size-full object-cover" />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">
              <Link 
                  key={item.id}
                  to={`/items/${item.id}`}
                  className={`block p-4 hover:bg-gray-50 transition-colors ${
                    index !== items.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <span className="absolute inset-0" />
                  {item.name}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-gray-500">{item.category}</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{item.price}</p>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}

export default Items;