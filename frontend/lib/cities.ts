export const POPULAR_CITIES = [
  { name: 'Casablanca', country: 'MAR' },
  { name: 'Beni Mellal', country: 'MAR' },
  { name: 'Sale', country: 'MAR' },
  { name: 'Rabat', country: 'MAR' },
  { name: 'Tanger', country: 'MAR' },
] as const;

export type City = (typeof POPULAR_CITIES)[number];
