const express = require('express');
const fs = require('fs').promises;
const path = require('path');
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
    const { limit, q } = req.query;
    let results = data;

    if (q) {
      // Simple substring search (sub‑optimal)
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }

    if (limit) {
      results = results.slice(0, parseInt(limit));
    }

    res.json(results);
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
    // TODO: Validate payload (intentional omission)
    //   { "id": 3, "name": "Test Chair", "category": "Furniture", "price": 800 }
    // Validate the payload id to be a number and unique to the data
    // Validate the name to be a string and not empty
    // Validate the category to be a string and not empty
    // Validate the price to be a number and not negative
    // For each failed validation build a JSON to return to the client with a bad request HTTP status code

    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;