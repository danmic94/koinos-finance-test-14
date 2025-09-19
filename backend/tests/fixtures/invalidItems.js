// Invalid item test fixtures organized by validation category

// Name validation test cases
const invalidNameItems = {
  missingName: { category: 'Electronics', price: 100 },
  nonStringName: { name: 123, category: 'Electronics', price: 100 },
  emptyName: { name: '', category: 'Electronics', price: 100 },
  whitespaceName: { name: '   ', category: 'Electronics', price: 100 },
  longName: { name: 'a'.repeat(101), category: 'Electronics', price: 100 }
};

// Category validation test cases
const invalidCategoryItems = {
  missingCategory: { name: 'Test Item', price: 100 },
  nonStringCategory: { name: 'Test Item', category: 123, price: 100 },
  emptyCategory: { name: 'Test Item', category: '', price: 100 },
  longCategory: { name: 'Test Item', category: 'a'.repeat(51), price: 100 }
};

// Price validation test cases
const invalidPriceItems = {
  missingPrice: { name: 'Test Item', category: 'Electronics' },
  nullPrice: { name: 'Test Item', category: 'Electronics', price: null },
  stringPrice: { name: 'Test Item', category: 'Electronics', price: 'not-a-number' },
  negativePrice: { name: 'Test Item', category: 'Electronics', price: -10 },
  overLimitPrice: { name: 'Test Item', category: 'Electronics', price: 1000000 },
  nanPrice: { name: 'Test Item', category: 'Electronics', price: NaN }
};

// ID validation test cases
const invalidIdItems = {
  nonIntegerId: { id: 'not-a-number', name: 'Test Item', category: 'Electronics', price: 100 },
  negativeId: { id: -1, name: 'Test Item', category: 'Electronics', price: 100 },
  zeroId: { id: 0, name: 'Test Item', category: 'Electronics', price: 100 },
  duplicateId: { id: 1, name: 'Test Item', category: 'Electronics', price: 100 }, // Assumes existing ID 1
  decimalId: { id: 1.5, name: 'Test Item', category: 'Electronics', price: 100 }
};

// Multiple errors test cases
const multipleErrorItems = {
  allInvalid: {
    id: -1,
    name: '',
    category: '',
    price: -100
  },
  multipleFieldErrors: {
    name: 123,
    category: null,
    price: 'invalid'
  }
};

// Valid test cases for edge cases
const edgeCaseItems = {
  validWithoutId: { name: 'Test Item', category: 'Electronics', price: 100 },
  validWithCustomId: { id: 999, name: 'Test Item', category: 'Electronics', price: 100 },
  firstItem: { name: 'First Item', category: 'Electronics', price: 100 },
  itemWithWhitespace: { 
    name: '  Test Item  ', 
    category: '  Electronics  ', 
    price: 100 
  },
  freeItem: { name: 'Free Item', category: 'Electronics', price: 0 },
  expensiveItem: { name: 'Expensive Item', category: 'Electronics', price: 999999 }
};

// Expected error messages for validation
const expectedErrors = {
  name: {
    required: 'Name is required and must be a string',
    empty: 'Name cannot be empty',
    tooLong: 'Name must be 100 characters or less'
  },
  category: {
    required: 'Category is required and must be a string',
    empty: 'Category cannot be empty',
    tooLong: 'Category must be 50 characters or less'
  },
  price: {
    required: 'Price is required',
    invalidNumber: 'Price must be a valid number',
    negative: 'Price cannot be negative',
    tooHigh: 'Price must be less than $999,999'
  },
  id: {
    invalidInteger: 'ID must be a positive integer',
    duplicate: 'ID already exists and must be unique'
  }
};

module.exports = {
  invalidNameItems,
  invalidCategoryItems,
  invalidPriceItems,
  invalidIdItems,
  multipleErrorItems,
  edgeCaseItems,
  expectedErrors
};
