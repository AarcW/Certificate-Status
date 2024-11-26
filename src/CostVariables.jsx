// src/constants.js
export const GRADESHEET_COST_PER_SEMESTER = 100;
export const A4_ENVELOPE_COST = 20;
export const LEGAL_ENVELOPE_COST = 40;
export const POSTAL_COSTS = {
  India: 250,
  USA: 3600,
  Canada: 4200,
  Others: 3600,
};
export const YEARS = Array.from({ length: 21 }, (_, i) => `${2004 + i}-${2005 + i}`);
export const COUNTRIES = ["India", "USA", "Canada", "Others"];
