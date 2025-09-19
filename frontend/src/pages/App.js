import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';
import ErrorBoundary from '../components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<p style={{color: 'red'}}>Something went wrong</p>}>
      <DataProvider>
        <nav style={{padding: 16, borderBottom: '1px solid #ddd'}}>
          <Link to="/">Items</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </DataProvider>
    </ErrorBoundary>
  );
}

export default App;