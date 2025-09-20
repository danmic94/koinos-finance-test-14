import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';
import ErrorBoundary from '../components/ErrorBoundary';

function App() {
  // Enhanced error handling callbacks
  const handleError = (error, errorInfo, errorDetails) => {
    // Custom error handling logic
    console.log('App level error handler:', { error, errorInfo, errorDetails });
    
    // Could send to analytics, show toast notifications, etc.
    // Example: analytics.track('error_boundary_triggered', errorDetails);
  };

  const handleReportError = (error, errorId) => {
    // Handle error reporting
    console.log('User requested error report:', { error, errorId });
    
    // Example: Open support chat, send to help desk, etc.
    // window.Intercom?.('showNewMessage', `Error Report: ${errorId}`);
  };

  return (
    <ErrorBoundary 
      maxRetries={2}
      onError={handleError}
      onReportError={handleReportError}
      userId="demo-user" // Could come from auth context
    >
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