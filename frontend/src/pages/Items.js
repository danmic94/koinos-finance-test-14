import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Items</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {items.map((item, index) => (
          <Link 
            key={item.id}
            to={`/items/${item.id}`}
            className={`block p-4 hover:bg-gray-50 transition-colors ${
              index !== items.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">{item.name}</span>
              <span className="text-gray-500 text-sm">${item.price}</span>
            </div>
            <span className="text-gray-600 text-sm">{item.category}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Items;