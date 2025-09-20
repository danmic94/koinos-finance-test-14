import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ItemCard from '../components/ItemCard';

// We don't need to mock navigation since we're testing the link href directly

describe('ItemCard Component', () => {
  const mockItem = {
    id: 1,
    name: 'Test Product',
    category: 'Electronics',
    price: 299
  };


  test('renders item information correctly', () => {
    render(
      <MemoryRouter>
        <ItemCard item={mockItem} index={0} count={10} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('299')).toBeInTheDocument();
  });

  test('navigates to item detail when clicked', () => {
    render(
      <MemoryRouter>
        <ItemCard item={mockItem} index={0} count={10} />
      </MemoryRouter>
    );

    const card = screen.getByRole('link');
    
    // Check that the link has the correct href instead of testing navigation
    expect(card).toHaveAttribute('href', '/items/1');
  });

  test('renders placeholder image with correct alt text', () => {
    render(
      <MemoryRouter>
        <ItemCard item={mockItem} index={0} count={10} />
      </MemoryRouter>
    );

    const image = screen.getByAltText('placeholder product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('placeholder-product.jpg'));
  });
});
