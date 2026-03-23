export const CATEGORIES = [
  'Market',
  'Kozmetik',
  'Eğlence',
  'Gıda',
  'Konut',
  'Ulaşım',
  'Sağlık',
  'Giyim',
  'Diğer',
] as const

export type Category = (typeof CATEGORIES)[number]
