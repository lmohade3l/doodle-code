import { client } from './client';
import type { InsuranceType, QuotesResponse } from '../types';

export type QuotesParams = {
  type: InsuranceType;
  page: number;
  pageSize: number;
  company: string;
};

export async function fetchQuotes(params: QuotesParams) {
  const { data } = await client.get('/quotes', { params });
  return data as QuotesResponse;
}

export async function fetchCompanies(q: string , signal: AbortSignal) {
  const { data } = await client.get('/companies', { params: { q } , signal: signal });
  return data as string[];
}
