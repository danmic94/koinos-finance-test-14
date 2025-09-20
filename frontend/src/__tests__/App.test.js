import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../pages/App';

// Mock fetch to prevent API calls during tests
global.fetch = jest.fn();

// Simple mock for DataContext to avoid API dependencies
jest.mock('../state/DataContext', () => ({
  DataProvider: ({ children }) => <div data-testid="data-provider">{children}</div>,
  useData: () => ({
    items: [
      { id: 1, name: 'Test Item 1', category: 'Electronics', price: 100 },
      { id: 2, name: 'Test Item 2', category: 'Books', price: 20 }
    ],
    fetchItems: jest.fn()
  })
}));

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders homepage with Items component', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Items')).toBeInTheDocument();
    expect(screen.getByText('Trending products')).toBeInTheDocument();
  });

  test('renders 404 page for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByText('Back to home')).toBeInTheDocument();
  });

  test('renders item detail page for /items/:id route', () => {
    render(
      <MemoryRouter initialEntries={['/items/1']}>
        <App />
      </MemoryRouter>
    );

    // Should render ItemDetail component (will show loading initially)
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
