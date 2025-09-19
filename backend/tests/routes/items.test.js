const request = require('supertest');
const { validItems, newValidItem } = require('../fixtures/testData');

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
        .expect(201);  // The route doesn't validate input (intentional omission per comment)

      expect(response.body.id).toBeDefined();
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
