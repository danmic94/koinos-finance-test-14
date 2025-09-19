// Test data fixtures for consistent testing

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

module.exports = {
  validItems,
  newValidItem
};
