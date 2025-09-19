/**
 * Validates an item object for creating/updating items
 * @param {Object} item - The item to validate
 * @param {Array} existingIds - Array of existing item IDs to check uniqueness
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
function validateItem(item, existingIds = []) {
  const errors = {};

  // Validate ID (if provided)
  if (item.id !== undefined) {
    if (!Number.isInteger(item.id) || item.id <= 0) {
      errors.id = 'ID must be a positive integer';
    } else if (existingIds.includes(item.id)) {
      errors.id = 'ID already exists and must be unique';
    }
  }

  // Validate name
  if (!item.name || typeof item.name !== 'string') {
    errors.name = 'Name is required and must be a string';
  } else if (item.name.trim().length === 0) {
    errors.name = 'Name cannot be empty';
  } else if (item.name.length > 100) {
    errors.name = 'Name must be 100 characters or less';
  }

  // Validate category
  if (!item.category || typeof item.category !== 'string') {
    errors.category = 'Category is required and must be a string';
  } else if (item.category.trim().length === 0) {
    errors.category = 'Category cannot be empty';
  } else if (item.category.length > 50) {
    errors.category = 'Category must be 50 characters or less';
  }

  // Validate price
  if (item.price === undefined || item.price === null) {
    errors.price = 'Price is required';
  } else if (typeof item.price !== 'number' || isNaN(item.price)) {
    errors.price = 'Price must be a valid number';
  } else if (item.price < 0) {
    errors.price = 'Price cannot be negative';
  } else if (item.price > 999999) {
    errors.price = 'Price must be less than $999,999';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

module.exports = validateItem;