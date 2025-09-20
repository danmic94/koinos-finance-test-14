import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../state/DataContext';
import { useDebounce } from '../hooks/useDebounce';
import ItemCard from '../components/ItemCard';
import SearchInput from '../components/SearchInput';
import Pagination from '../components/Pagination';

function Items() {
  const { items, pagination, isLoading, fetchItems } = useData();
  const abortControllerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  
  // Debounce search input to avoid too many API calls
  const debouncedSearch = useDebounce(searchInput, 400);

  // Fetch items when page or search changes
  useEffect(() => {
    const loadItems = async () => {
      try {
        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();
        
        await fetchItems(
          {
            page: currentPage,
            limit: 12, // Nice grid layout with 12 items (3 rows of 4)
            search: debouncedSearch
          },
          abortControllerRef.current.signal
        );
      } catch (error) {
        // Don't log errors for aborted requests
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      }
    };

    loadItems();

    // Cleanup function to abort request if component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentPage, debouncedSearch, fetchItems]);

  // Reset to page 1 when search changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearch]); // Only depend on debouncedSearch, not currentPage

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state
  if (isLoading && items.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        {/* Header with search */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending products</h2>
            {pagination && (
              <p className="text-sm text-gray-500 mt-2">
                {pagination.total} {pagination.total === 1 ? 'product' : 'products'}
                {debouncedSearch && ` found for "${debouncedSearch}"`}
              </p>
            )}
          </div>
          
          <div className="mt-4 md:mt-0">
            <SearchInput
              value={searchInput}
              onChange={setSearchInput}
              isLoading={isLoading}
              placeholder="Search products or categories..."
            />
          </div>
        </div>

        {/* Results */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-gray-500">
              {debouncedSearch 
                ? `No products match "${debouncedSearch}". Try a different search term.`
                : "No products available at the moment."
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
            {items.map((item, index) => (
              <ItemCard 
                key={item?.id || `item-${index}`} 
                item={item} 
                index={index} 
                count={pagination?.total || items.length} 
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination 
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Items;