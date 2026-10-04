export type CarModel = {
  id: string;
  brand: string;
  model: string;
  year: number;
  label: string;
};

export type SearchResponse = {
  items: CarModel[];
  total: number;
};
