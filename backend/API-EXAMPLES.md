# API Examples - Items Endpoint

## Simple Pagination & Search Examples

### Basic Usage

```bash
# Get all items (default: page 1, limit 10)
GET /api/items

# Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Pagination

```bash
# Get page 2 with 5 items per page
GET /api/items?page=2&limit=5

# Get first 20 items
GET /api/items?limit=20
```

### Search

```bash
# Search by product name
GET /api/items?q=laptop

# Search by category
GET /api/items?q=electronics

# Search with spaces (automatically trimmed)
GET /api/items?q=%20%20headphones%20%20
```

### Combined Usage

```bash
# Search + Pagination
GET /api/items?q=electronics&page=1&limit=5

# Response includes search term:
{
  "data": [...],
  "pagination": {...},
  "searchTerm": "electronics"
}
```

### Limits & Defaults

- **Default page**: 1
- **Default limit**: 10
- **Max limit**: 100 (automatically capped)
- **Min page**: 1 (invalid pages default to 1)
- **Search**: Searches both `name` and `category` fields
- **Case insensitive**: Search is case insensitive
