import React, { createContext, useCallback, useContext, useState } from 'react';
import { apiUrls } from '../utils/api';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async (signal) => {
    try {
      const res = await fetch(`${apiUrls.items}?limit=500`, { 
        signal // Pass abort signal to fetch
      }); // Intentional bug: backend ignores limit
      
      // Check if request was aborted
      if (signal?.aborted) {
        return;
      }
      
      const json = await res.json();
      setItems(json); 
    } catch (error) {
      // Don't log errors for aborted requests
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);