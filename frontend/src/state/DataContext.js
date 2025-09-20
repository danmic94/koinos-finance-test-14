import React, { createContext, useCallback, useContext, useState } from 'react';
import { apiUrls } from '../utils/api';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = useCallback(async (options = {}, signal) => {
    const { page = 1, limit = 12, search = '' } = options;
    
    try {
      setIsLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { q: search })
      });
      
      const res = await fetch(`${apiUrls.items}?${params}`, { 
        signal // Pass abort signal to fetch
      });
      
      // Check if request was aborted
      if (signal?.aborted) {
        return;
      }
      
      if (!res.ok) {
        throw new Error('Failed to fetch items');
      }
      
      const json = await res.json();
      
      // Handle new paginated response format
      setItems(json.data || []);
      setPagination(json.pagination || null);
      setSearchTerm(json.searchTerm || search);
      
    } catch (error) {
      // Don't log errors for aborted requests
      if (error.name !== 'AbortError') {
        console.error('Error fetching items:', error);
        setItems([]);
        setPagination(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{ 
      items, 
      pagination,
      searchTerm,
      isLoading,
      fetchItems 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);