/**
 * cityData.ts
 *
 * Provides a structured array of cities for the lead capture forms.
 * Includes pinned major cities at the top, followed by an alphabetical list
 * of all other cities, and finally 'Others'.
 */

import rawArray from './cities.json';

const PINNED_CITIES = [
  'Bangalore',
  'Delhi',
  'Gurgaon',
  'Noida',
  'Mumbai',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad'
];

// Deduplicate and filter out pinned cities from the alphabetical list
// rawArray is imported from JSON automatically
const otherCities = Array.from(new Set(rawArray as string[]))
  .filter(city => !PINNED_CITIES.includes(city))
  .sort((a, b) => a.localeCompare(b));

// Final combined list
export const CITIES = [
  ...PINNED_CITIES,
  ...otherCities,
  'Others'
];

export const MAJOR_CITIES = PINNED_CITIES;
