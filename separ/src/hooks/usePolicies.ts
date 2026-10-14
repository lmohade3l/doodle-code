import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPolicies, fetchPolicy, payInstallment, type PolicyFilters } from '../api/policies';

export function usePolicies(filters: PolicyFilters) {
  return useQuery({
    queryKey: ['policies', filters],
    queryFn: () => fetchPolicies(filters),
    staleTime: 5 * 60_000,
  });
}

export function usePolicy(id: string) {
  return useQuery({
    queryKey: ['policy', id],
    queryFn: () => fetchPolicy(id),
    staleTime: 60_000,
  });
}

export function usePayInstallment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ policyId, n }: { policyId: string; n: number }) => payInstallment(policyId, n),
    onSuccess: (_data, { policyId }) => {
      queryClient.invalidateQueries({ queryKey: ['policy', policyId] });
      queryClient.invalidateQueries({ queryKey: ['policies'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
