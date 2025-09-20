import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Items from '../pages/Items';

// Mock react-window to avoid virtualization complexity in tests
jest.mock('react-window', () => ({
  List: ({ children, itemCount }) => {
    // Render first few items for testing
    const items = Array.from({ length: Math.min(itemCount, 3) }, (_, index) => 
      children({ index, style: {} })
    );
    return <div data-testid="virtualized-list">{items}</div>;
  }
}));

// Mock DataContext with test data
const mockItems = [
  { id: 1, name: 'Test Laptop', category: 'Electronics', price: 1500 },
  { id: 2, name: 'Test Book', category: 'Books', price: 25 },
  { id: 3, name: 'Test Chair', category: 'Furniture', price: 200 }
];

// Mock the entire DataContext module
jest.mock('../state/DataContext', () => ({
  useData: jest.fn(() => ({
    items: [],
    fetchItems: jest.fn()
  }))
}));

// Mock ItemCard component for simple testing
jest.mock('../components/ItemCard', () => {
  return function MockItemCard({ item }) {
    return (
      <div data-testid={`item-${item.id}`}>
        <h3>{item.name}</h3>
        <p>{item.category}</p>
        <span>${item.price}</span>
      </div>
    );
  };
});

// Import the mocked useData after setting up the mock
import { useData } from '../state/DataContext';
const mockUseData = useData;

describe('Items Component', () => {
  beforeEach(() => {
    // Reset to default mock data before each test
    mockUseData.mockReturnValue({
      items: mockItems,
      fetchItems: jest.fn()
    });
  });

  test('renders items list with correct data', () => {
    render(
      <MemoryRouter>
        <Items />
      </MemoryRouter>
    );

    expect(screen.getByText('Trending products')).toBeInTheDocument();
    expect(screen.getByText('3 products')).toBeInTheDocument();
    
    // Check if items are rendered
    expect(screen.getByText('Test Laptop')).toBeInTheDocument();
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  test('shows loading state when no items', () => {
    // Override mock to return empty items
    mockUseData.mockReturnValue({
      items: [],
      fetchItems: jest.fn()
    });
    
    render(
      <MemoryRouter>
        <Items />
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('handles single item count correctly', () => {
    // Override mock to return single item
    mockUseData.mockReturnValue({
      items: [{ id: 1, name: 'Single Item', category: 'Test', price: 100 }],
      fetchItems: jest.fn()
    });
    
    render(
      <MemoryRouter>
        <Items />
      </MemoryRouter>
    );

    expect(screen.getByText('1 product')).toBeInTheDocument();
    expect(screen.getByText('Single Item')).toBeInTheDocument();
  });
});
