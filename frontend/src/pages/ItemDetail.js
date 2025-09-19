import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../utils/api';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const fetchItemDetail = async (itemId) => {
      try {
        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();
        
        const response = await fetch(buildApiUrl(`/items/${itemId}`), {
          signal: abortControllerRef.current.signal
        });
        
        const data = await response.json();
        if(!response.ok) {
          throw new Error('Failed to fetch item');
        } else {
          setItem(data);
        }
      } catch (error) {
        // Don't log errors for aborted requests
        if (error.name !== 'AbortError') {
          console.error(error);
        }
      }
    };

    fetchItemDetail(id);

    // Cleanup function to abort request if component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [id]); // Re-fetch when id changes

  if (!item) return <p>Loading...</p>;

  return (
    <div style={{padding: 16}}>
      <h2>{item.name}</h2>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Price:</strong> ${item.price}</p>
    </div>
  );
}

export default ItemDetail;