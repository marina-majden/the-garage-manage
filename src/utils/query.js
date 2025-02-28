import { orderBy, startAfter, limit, where } from 'firebase/firestore';

/**
 * Firestore query utilities for sorting, pagination, and filtering
 */

/**
 * Create sorting query constraints
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - 'asc' or 'desc'
 * @returns {Array} Firestore query constraints
 */
export const createSortQuery = (sortBy, sortOrder = 'asc') => {
  return [orderBy(sortBy, sortOrder)];
};

/**
 * Create pagination query constraints
 * @param {number} pageSize - Number of items per page
 * @param {DocumentSnapshot|null} lastVisible - Last visible document for pagination
 * @returns {Array} Firestore query constraints
 */
export const createPaginationQuery = (pageSize, lastVisible = null) => {
  const constraints = [limit(pageSize)];
  if (lastVisible) {
    constraints.push(startAfter(lastVisible));
  }
  return constraints;
};

/**
 * Create filter query constraints
 * @param {Array} filters - Array of filter objects {field, operator, value}
 * @returns {Array} Firestore query constraints
 */
export const createFilterQuery = (filters = []) => {
  return filters.map(({ field, operator = '==', value }) => 
    where(field, operator, value)
  );
};

/**
 * Combine multiple query constraints
 * @param {...Array} queries - Multiple query constraint arrays
 * @returns {Array} Combined query constraints
 */
export const combineQueries = (...queries) => {
  return queries.flat();
};

// Usage examples in services:
// const sortQuery = createSortQuery('name', 'asc');
// const paginationQuery = createPaginationQuery(10, lastDoc);
// const filterQuery = createFilterQuery([{ field: 'makeId', value: 'bmw123' }]);
// const combined = combineQueries(sortQuery, paginationQuery, filterQuery);
// await getDocs(query(collectionRef, ...combined));

// Add these to existing query functions
export const createTextSearchQuery = (field, searchTerm) => {
  return [
    where(field, '>=', searchTerm),
    where(field, '<=', searchTerm + '\uf8ff')
  ];
};

export const createRangeQuery = (field, min, max) => {
  const conditions = [];
  if (min !== null) conditions.push(where(field, '>=', min));
  if (max !== null) conditions.push(where(field, '<=', max));
  return conditions;
};
