export const POPULAR_CITIES = [
  { name: 'casablanca', country: 'MAR' },
  { name: 'sale', country: 'MAR' },
  { name: 'benimellal', country: 'MAR' },
] as const;

export type City = (typeof POPULAR_CITIES)[number];
