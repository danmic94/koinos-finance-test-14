// Valid test data fixtures for consistent testing

const validItems = [
  { "id": 1, "name": "Test Laptop", "category": "Electronics", "price": 1500 },
  { "id": 2, "name": "Test Headphones", "category": "Electronics", "price": 200 },
  { "id": 3, "name": "Test Chair", "category": "Furniture", "price": 800 }
];

const newValidItem = {
  "name": "Test Monitor", 
  "category": "Electronics", 
  "price": 600
};

// Additional valid items for specific test scenarios
const validTestItems = {
  basicItem: { name: 'Basic Item', category: 'Test', price: 50 },
  maxLengthName: { name: 'a'.repeat(100), category: 'Test', price: 100 },
  maxLengthCategory: { name: 'Test Item', category: 'a'.repeat(50), price: 100 },
  decimalPrice: { name: 'Decimal Price Item', category: 'Test', price: 99.99 }
};

module.exports = {
  validItems,
  newValidItem,
  validTestItems
};
