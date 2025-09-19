const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');


// Cache for stats to avoid recalculating on every request
let statsCache = null;
let cacheTimestamp = null;

// Watch for file changes to invalidate cache
fs.watchFile(DATA_PATH, (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    console.log('Data file changed, invalidating stats cache');
    statsCache = null;
    cacheTimestamp = null;
  }
});

// Function to calculate stats from items data
function calculateStats(items) {
  // Intentional heavy CPU calculation (as mentioned in original comment)
  const stats = {
    total: items.length,
    averagePrice: items.length > 0 ? items.reduce((acc, cur) => acc + cur.price, 0) / items.length : 0
  };
  return stats;
}

// GET /api/stats
router.get('/', (req, res, next) => {
  // Check if we have cached stats and they're still valid
  if (statsCache && cacheTimestamp) {
    console.log('Serving cached stats');
    return res.json(statsCache);
  }

  // No cache or cache is invalid, read file and calculate stats
  fs.readFile(DATA_PATH, (err, raw) => {
    if (err) return next(err);

    try {
      const items = JSON.parse(raw);
      const stats = calculateStats(items);
      
      // Cache the results
      statsCache = stats;
      cacheTimestamp = Date.now();
      
      console.log('Calculated and cached new stats');
      res.json(stats);
    } catch (parseErr) {
      next(parseErr);
    }
  });
});

module.exports = router;