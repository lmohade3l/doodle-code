export type InsuranceType = 'third-party' | 'body' | 'travel';

export type SortOrder = 'default' | 'price-asc' | 'price-desc';

export type Quote = {
  id: string;
  type: InsuranceType;
  company: string;
  plan: string;
  price: number;
  coverage: string;
};

export type QuotesResponse = {
  items: Quote[];
  total: number;
  page: number;
  pageSize: number;
};

export type Order = {
  id: string;
  quoteId: string;
  company: string;
  fullName: string;
  nationalCode: string;
  mobile: string;
  extraCoverage: boolean;
  total: number;
  createdAt: string;
};

export type NewOrder = {
  quoteId: string;
  fullName: string;
  nationalCode: string;
  mobile: string;
  extraCoverage: boolean;
};
