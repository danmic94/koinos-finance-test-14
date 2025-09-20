# Frontend Features - Search & Pagination

## Overview
The Items page now includes modern search and pagination functionality with a clean, responsive design.

## Features Implemented

### 🔍 **Smart Search**
- **Real-time search** across product names and categories
- **400ms debounce** to prevent excessive API calls
- **Loading spinner** in search input during API requests
- **Search term highlighting** in results summary
- **Auto-reset to page 1** when search changes

### 📄 **Clean Pagination**
- **Responsive design** (mobile + desktop layouts)
- **Page numbers** with current page highlighting
- **Previous/Next** navigation buttons
- **Smart page range** display (current ± 2 pages)
- **Smooth scroll to top** when changing pages
- **Auto-hide** when only 1 page of results

### 🎨 **Polished UI/UX**
- **Professional loading states** with spinners
- **Empty state messaging** for no results
- **Responsive grid layout** (2 cols mobile, 4 cols desktop)
- **Modern Tailwind CSS styling**
- **Accessibility features** (ARIA labels, keyboard navigation)

## Technical Details

### Components Created
- **`SearchInput`** - Reusable search with loading state
- **`Pagination`** - Responsive pagination controls
- **`useDebounce`** - Custom hook for debouncing

### Data Flow
1. User types in search → debounced (400ms)
2. API call with search + pagination params
3. Results update with loading states
4. Pagination controls update automatically

### Performance
- **Debounced search** prevents API spam
- **AbortController** cancels outdated requests
- **Efficient re-renders** with proper dependencies
- **12 items per page** for optimal loading

## Usage Examples

```javascript
// Search for laptops
Type "laptop" → API call after 400ms → Results filtered

// Navigate pages
Click "Next" → Smooth scroll to top → New results load

// Combined search + pagination
Search "electronics" → Page 1 results → Click page 2 → Paginated search results
```

## Responsive Behavior
- **Mobile**: Simplified pagination (Prev/Next only)
- **Desktop**: Full pagination with page numbers
- **Search**: Always visible and responsive
- **Grid**: Adapts from 2 to 4 columns based on screen size
