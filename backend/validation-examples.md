# Item Validation Examples

## Valid Item Examples

### ✅ Valid new item (no ID provided - will auto-generate next ID)
```json
{
  "name": "Gaming Laptop",
  "category": "Electronics",
  "price": 1299.99
}
```
**Response:** (ID auto-generated as next sequential integer)
```json
{
  "id": 6,
  "name": "Gaming Laptop",
  "category": "Electronics",
  "price": 1299.99
}
```

### ✅ Valid item with ID
```json
{
  "id": 999,
  "name": "Wireless Mouse",
  "category": "Electronics", 
  "price": 29.99
}
```

## Invalid Item Examples

### ❌ Missing required fields
```json
{
  "name": "Incomplete Item"
}
```
**Response:**
```json
{
  "error": "Validation failed",
  "details": {
    "category": "Category is required and must be a string",
    "price": "Price is required"
  }
}
```

### ❌ Invalid data types
```json
{
  "name": 123,
  "category": "Electronics",
  "price": "not-a-number"
}
```
**Response:**
```json
{
  "error": "Validation failed", 
  "details": {
    "name": "Name is required and must be a string",
    "price": "Price must be a valid number"
  }
}
```

### ❌ Empty/invalid values
```json
{
  "name": "",
  "category": "   ",
  "price": -50
}
```
**Response:**
```json
{
  "error": "Validation failed",
  "details": {
    "name": "Name cannot be empty",
    "category": "Category cannot be empty", 
    "price": "Price cannot be negative"
  }
}
```

### ❌ Duplicate ID
```json
{
  "id": 1,
  "name": "Duplicate Item",
  "category": "Test",
  "price": 100
}
```
**Response:**
```json
{
  "error": "Validation failed",
  "details": {
    "id": "ID already exists and must be unique"
  }
}
```

## ID Generation Logic

- **Auto-generated IDs**: When no ID is provided, the system finds the highest existing ID and adds 1
- **Sequential integers**: IDs are simple integers (1, 2, 3, 4, 5, 6...)
- **Custom IDs**: You can provide your own ID, but it must be unique and a positive integer

**Examples:**
- Current data has IDs: [1, 2, 3, 4, 5]
- New item without ID → gets ID: 6
- Empty database → first item gets ID: 1

## Test with curl

```bash
# Valid item
curl -X POST http://localhost:3001/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item", "category": "Test", "price": 99.99}'

# Invalid item
curl -X POST http://localhost:3001/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "", "price": -10}'
```
