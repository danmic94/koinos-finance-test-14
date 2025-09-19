const request = require('supertest');
const { validItems, newValidItem } = require('../fixtures/testData');
const { 
  invalidNameItems, 
  invalidCategoryItems, 
  invalidPriceItems, 
  invalidIdItems, 
  multipleErrorItems, 
  edgeCaseItems, 
  expectedErrors 
} = require('../fixtures/invalidItems');

// Mock fs module before importing the items router
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn()
  }
}));

const fs = require('fs').promises;
const { createTestApp } = require('../helpers/testApp');

describe('Items Routes', () => {
  let app;
  
  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/items', () => {
    beforeEach(() => {
      // Set up default successful file read
      fs.readFile.mockResolvedValue(JSON.stringify(validItems));
      fs.writeFile.mockResolvedValue();
    });

    test('should return all items when no query parameters', async () => {
      const response = await request(app)
        .get('/api/items')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(validItems);
    });

    test('should limit results when limit parameter is provided', async () => {
      const response = await request(app)
        .get('/api/items?limit=2')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(validItems.slice(0, 2));
    });

    test('should filter results when search query is provided', async () => {
      const response = await request(app)
        .get('/api/items?q=laptop')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Test Laptop');
    });

    test('should filter case-insensitively', async () => {
      const response = await request(app)
        .get('/api/items?q=LAPTOP')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Test Laptop');
    });

    test('should combine search and limit parameters', async () => {
      const response = await request(app)
        .get('/api/items?q=test&limit=2')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.every(item => item.name.toLowerCase().includes('test'))).toBe(true);
    });

    test('should return empty array when no items match search', async () => {
      const response = await request(app)
        .get('/api/items?q=nonexistent')
        .expect(200);

      expect(response.body).toHaveLength(0);
      expect(response.body).toEqual([]);
    });

    test('should handle file read errors gracefully', async () => {
      // Override the mock for this specific test
      fs.readFile.mockRejectedValue(new Error('File not found'));

      const response = await request(app)
        .get('/api/items')
        .expect(500);

      expect(response.body.error).toBe('File not found');
    });
  });

  describe('GET /api/items/:id', () => {
    beforeEach(() => {
      // Set up default successful file read
      fs.readFile.mockResolvedValue(JSON.stringify(validItems));
      fs.writeFile.mockResolvedValue();
    });

    test('should return item when valid ID is provided', async () => {
      const response = await request(app)
        .get('/api/items/1')
        .expect(200);

      expect(response.body).toEqual(validItems[0]);
      expect(response.body.id).toBe(1);
    });

    test('should return 404 when item not found', async () => {
      const response = await request(app)
        .get('/api/items/999')
        .expect(404);

      expect(response.body.error).toBe('Item not found');
    });

    test('should handle invalid ID format', async () => {
      const response = await request(app)
        .get('/api/items/invalid')
        .expect(404);

      expect(response.body.error).toBe('Item not found');
    });

    test('should handle file read errors gracefully', async () => {
      fs.readFile.mockRejectedValue(new Error('File not found'));

      const response = await request(app)
        .get('/api/items/1')
        .expect(500);

      expect(response.body.error).toBe('File not found');
    });
  });

  describe('POST /api/items', () => {
    beforeEach(() => {
      // Set up default successful file operations
      fs.readFile.mockResolvedValue(JSON.stringify(validItems));
      fs.writeFile.mockResolvedValue();
    });

    test('should create new item with valid data', async () => {
      const response = await request(app)
        .post('/api/items')
        .send(newValidItem)
        .expect(201);

      expect(response.body.name).toBe(newValidItem.name);
      expect(response.body.category).toBe(newValidItem.category);
      expect(response.body.price).toBe(newValidItem.price);
      expect(response.body.id).toBeDefined();
      expect(typeof response.body.id).toBe('number');
    });

    test('should handle missing request body', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({})
        .expect(400);  // The route doesn't validate input (intentional omission per comment)

      expect(response.body.id).toBeUndefined();
    });

    test('should handle file read errors gracefully', async () => {
      fs.readFile.mockRejectedValue(new Error('File not found'));

      const response = await request(app)
        .post('/api/items')
        .send(newValidItem)
        .expect(500);

      expect(response.body.error).toBe('File not found');
    });

    test('should handle file write errors gracefully', async () => {
      fs.writeFile.mockRejectedValue(new Error('Permission denied'));

      const response = await request(app)
        .post('/api/items')
        .send(newValidItem)
        .expect(500);

      expect(response.body.error).toBe('Permission denied');
    });

    test('should handle JSON parsing errors gracefully', async () => {
      fs.readFile.mockResolvedValue('invalid json');

      const response = await request(app)
        .post('/api/items')
        .send(newValidItem)
        .expect(500);

      expect(response.body.error).toContain('Unexpected token');
    });
  });

  describe('POST /api/items - Validation Tests', () => {
    beforeEach(() => {
      // Set up default successful file operations
      fs.readFile.mockResolvedValue(JSON.stringify(validItems));
      fs.writeFile.mockResolvedValue();
    });

    describe('Invalid Name Field', () => {
      test('should reject missing name', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidNameItems.missingName)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details.name).toBe(expectedErrors.name.required);
      });

      test('should reject non-string name', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidNameItems.nonStringName)
          .expect(400);

        expect(response.body.details.name).toBe(expectedErrors.name.required);
      });

      test('should reject empty name', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidNameItems.emptyName)
          .expect(400);

        expect(response.body.details.name).toBe(expectedErrors.name.required);
      });

      test('should reject whitespace-only name', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidNameItems.whitespaceName)
          .expect(400);

        expect(response.body.details.name).toBe(expectedErrors.name.empty);
      });

      test('should reject name longer than 100 characters', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidNameItems.longName)
          .expect(400);

        expect(response.body.details.name).toBe(expectedErrors.name.tooLong);
      });
    });

    describe('Invalid Category Field', () => {
      test('should reject missing category', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidCategoryItems.missingCategory)
          .expect(400);

        expect(response.body.details.category).toBe(expectedErrors.category.required);
      });

      test('should reject non-string category', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidCategoryItems.nonStringCategory)
          .expect(400);

        expect(response.body.details.category).toBe(expectedErrors.category.required);
      });

      test('should reject empty category', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidCategoryItems.emptyCategory)
          .expect(400);

        expect(response.body.details.category).toBe(expectedErrors.category.required);
      });

      test('should reject category longer than 50 characters', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidCategoryItems.longCategory)
          .expect(400);

        expect(response.body.details.category).toBe(expectedErrors.category.tooLong);
      });
    });

    describe('Invalid Price Field', () => {
      test('should reject missing price', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidPriceItems.missingPrice)
          .expect(400);

        expect(response.body.details.price).toBe(expectedErrors.price.required);
      });

      test('should reject null price', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidPriceItems.nullPrice)
          .expect(400);

        expect(response.body.details.price).toBe(expectedErrors.price.required);
      });

      test('should reject string price', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidPriceItems.stringPrice)
          .expect(400);

        expect(response.body.details.price).toBe(expectedErrors.price.invalidNumber);
      });

      test('should reject negative price', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidPriceItems.negativePrice)
          .expect(400);

        expect(response.body.details.price).toBe(expectedErrors.price.negative);
      });

      test('should reject price over limit', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidPriceItems.overLimitPrice)
          .expect(400);

        expect(response.body.details.price).toBe(expectedErrors.price.tooHigh);
      });

      test('should reject NaN price', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidPriceItems.nanPrice)
          .expect(400);

        expect(response.body.details.price).toBe(expectedErrors.price.required);
      });
    });

    describe('Invalid ID Field', () => {
      test('should reject non-integer ID', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidIdItems.nonIntegerId)
          .expect(400);

        expect(response.body.details.id).toBe(expectedErrors.id.invalidInteger);
      });

      test('should reject negative ID', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidIdItems.negativeId)
          .expect(400);

        expect(response.body.details.id).toBe(expectedErrors.id.invalidInteger);
      });

      test('should reject zero ID', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidIdItems.zeroId)
          .expect(400);

        expect(response.body.details.id).toBe(expectedErrors.id.invalidInteger);
      });

      test('should reject duplicate ID', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidIdItems.duplicateId)
          .expect(400);

        expect(response.body.details.id).toBe(expectedErrors.id.duplicate);
      });

      test('should reject decimal ID', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(invalidIdItems.decimalId)
          .expect(400);

        expect(response.body.details.id).toBe(expectedErrors.id.invalidInteger);
      });
    });

    describe('Multiple Validation Errors', () => {
      test('should return all validation errors for completely invalid item', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(multipleErrorItems.allInvalid)
          .expect(400);

        expect(response.body.error).toBe('Validation failed');
        expect(response.body.details).toEqual({
          id: expectedErrors.id.invalidInteger,
          name: expectedErrors.name.required,
          category: expectedErrors.category.required,
          price: expectedErrors.price.negative
        });
      });

      test('should return multiple field errors', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(multipleErrorItems.multipleFieldErrors)
          .expect(400);

        expect(Object.keys(response.body.details)).toHaveLength(3);
        expect(response.body.details.name).toBe(expectedErrors.name.required);
        expect(response.body.details.category).toBe(expectedErrors.category.required);
        expect(response.body.details.price).toBe(expectedErrors.price.invalidNumber);
      });
    });

    describe('ID Generation Tests', () => {
      test('should generate sequential ID when not provided', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(edgeCaseItems.validWithoutId)
          .expect(201);

        // With validItems having IDs [1, 2, 3], next should be 4
        expect(response.body.id).toBe(4);
        expect(response.body.name).toBe('Test Item');
      });

      test('should accept valid custom ID', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(edgeCaseItems.validWithCustomId)
          .expect(201);

        expect(response.body.id).toBe(999);
      });
    });

    describe('Edge Cases', () => {
      test('should handle empty data array for ID generation', async () => {
        fs.readFile.mockResolvedValue(JSON.stringify([]));
        
        const response = await request(app)
          .post('/api/items')
          .send(edgeCaseItems.firstItem)
          .expect(201);

        expect(response.body.id).toBe(1);
      });

      test('should trim whitespace from name and category', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(edgeCaseItems.itemWithWhitespace)
          .expect(201);

        expect(response.body.name).toBe('Test Item');
        expect(response.body.category).toBe('Electronics');
      });

      test('should accept price of 0', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(edgeCaseItems.freeItem)
          .expect(201);

        expect(response.body.price).toBe(0);
      });

      test('should accept maximum valid price', async () => {
        const response = await request(app)
          .post('/api/items')
          .send(edgeCaseItems.expensiveItem)
          .expect(201);

        expect(response.body.price).toBe(999999);
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle malformed JSON in request body', async () => {
      const response = await request(app)
        .post('/api/items')
        .type('json')
        .send('{"invalid": json}')
        .expect(400);
    });

    test('should handle unsupported HTTP methods', async () => {
      const response = await request(app)
        .put('/api/items/1')
        .expect(404);

      expect(response.body.error).toBe('Route Not Found');
    });

    test('should handle DELETE requests (not implemented)', async () => {
      const response = await request(app)
        .delete('/api/items/1')
        .expect(404);

      expect(response.body.error).toBe('Route Not Found');
    });
  });
});
