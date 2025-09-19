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

  if (!items.length) return <p>Loading...</p>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Link to={`/items/${item.id}`}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Items;