export type Rating = 1 | 2 | 3 | 4 | 5;

export const RATING_LABELS: Record<Rating, string> = {
  1: 'Beginner',
  2: 'Familiar',
  3: 'Proficient',
  4: 'Advanced',
  5: 'Expert',
};

export const RATING_LABELS_FI: Record<Rating, string> = {
  1: 'Aloittelija',
  2: 'Tuttu',
  3: 'Osaava',
  4: 'Edistynyt',
  5: 'Asiantuntija',
};
