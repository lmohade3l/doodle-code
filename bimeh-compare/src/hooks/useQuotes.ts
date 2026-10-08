import { useQuery } from '@tanstack/react-query';
import { fetchQuotes } from '../api/quotes';
import type { InsuranceType } from '../types';

export const PAGE_SIZE = 6;

type Params = {
  type: InsuranceType;
  page: number;
  company: string;
};

export function useQuotes({ type, page, company }: Params) {
  return useQuery({
    queryKey: ['quotes', page, company],
    queryFn: () => fetchQuotes({ type, page, pageSize: PAGE_SIZE, company }),
    staleTime: 30_000,
  });
}
