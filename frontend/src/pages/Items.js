import React, { useEffect, useRef, useState } from 'react';
import { List } from 'react-window';
import { useData } from '../state/DataContext';
import ItemCard from '../components/ItemCard';

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

  // Simple row component that shows 4 items per row
  const Row = ({ index, style }) => {
    // Add safety checks
    if (!items || !Array.isArray(items) || items.length === 0) {
      return null;
    }

    const startIndex = index * 4;
    const rowItems = items.slice(startIndex, startIndex + 4).filter(item => item); // Filter out any null/undefined items
    
    if (rowItems.length === 0) {
      return null;
    }
    
    return (
      <div style={style || {}}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8 mb-10">
          {rowItems.map((item, itemIndex) => (
            <ItemCard 
              key={item?.id || `item-${startIndex + itemIndex}`} 
              item={item} 
              index={startIndex + itemIndex} 
              count={items.length} 
            />
          ))}
        </div>
      </div>
    );
  };

  // Safety check for items array
  if (!items || !Array.isArray(items) || items.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // Calculate number of rows (4 items per row)
  const rowCount = Math.ceil(items.length / 4);
  
  // If there are very few items, just render normally without virtualization
  if (items.length <= 8) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending products</h2>
            <p className="text-sm text-gray-500 mt-2 md:mt-0">
              {items.length} {items.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
            {items.map((item, index) => (
              <ItemCard 
                key={item?.id || `item-${index}`} 
                item={item} 
                index={index} 
                count={items.length} 
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Trending products</h2>
          <p className="text-sm text-gray-500 mt-2 md:mt-0">
            {items.length} {items.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        <div className="mt-6">
          {rowCount > 0 && (
            <List
              height={600} // Fixed height for scrollable area
              itemCount={rowCount}
              itemSize={400} // Height per row (including items + gap)
              width="100%"
            >
              {Row}
            </List>
          )}
        </div>
      </div>
    </div>
  );
}

export default Items;