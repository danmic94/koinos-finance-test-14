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

  if (!item) return (
    <div className="flex justify-center items-center py-8">
      <p className="text-gray-600">Loading...</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        ← Back to Items
      </button>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.name}</h1>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium text-gray-900">{item.category}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="text-2xl font-bold text-green-600">${item.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;