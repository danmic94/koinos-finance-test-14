import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PageNotFound from '../pages/NotFound';

// Mock router navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props} data-testid="back-link">
      {children}
    </a>
  )
}));

describe('NotFound Component', () => {
  test('renders 404 page with correct content', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByText("Sorry, we couldn’t find the page you’re looking for.")).toBeInTheDocument();
  });

  test('contains back to home link', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );

    const backLink = screen.getByTestId('back-link');
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
    expect(screen.getByText('Back to home')).toBeInTheDocument();
  });

  test('renders company logo images', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });
});
