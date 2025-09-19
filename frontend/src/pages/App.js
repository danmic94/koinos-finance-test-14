import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';
import ErrorBoundary from '../components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<p className="text-red-500 p-4">Something went wrong</p>}>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm border-b border-gray-200 p-4">
            <Link 
              to="/" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Items
            </Link>
          </nav>
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Items />} />
              <Route path="/items/:id" element={<ItemDetail />} />
            </Routes>
          </main>
        </div>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;