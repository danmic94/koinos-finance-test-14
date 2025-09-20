const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const validateItem = require('../utils/items');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data asynchronously (non-blocking)
async function readData() {
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

// Utility to write data asynchronously (non-blocking)
async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    let { limit, page, q } = req.query;
    let results = data;

    // Search functionality - search across name and category
    if (q && q.trim()) {
      const searchTerm = q.trim().toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      );
    }

    // Get total count before pagination for metadata
    const total = results.length;

    // Pagination logic
    const pageNum = Math.max(1, parseInt(page) || 1); // Default to page 1
    const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Default 10, max 100
    const offset = (pageNum - 1) * limitNum;
    
    // Apply pagination
    const paginatedResults = results.slice(offset, offset + limitNum);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    // Return data with pagination metadata
    res.json({
      data: paginatedResults,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      ...(q && { searchTerm: q.trim() }) // Include search term if provided
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    const item = req.body;
    const data = await readData();
    
    // Get existing IDs for uniqueness validation
    const existingIds = data.map(existingItem => existingItem.id);
    
    // Validate the item
    const validation = validateItem(item, existingIds);
    
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }
    
    // Generate ID if not provided (common case for new items)
    if (!item.id) {
      // Find the highest existing ID and increment by 1
      const maxId = data.length > 0 ? Math.max(...data.map(item => item.id)) : 0;
      item.id = maxId + 1;
    }
    
    // Trim whitespace from string fields
    item.name = item.name.trim();
    item.category = item.category.trim();
    
    data.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;