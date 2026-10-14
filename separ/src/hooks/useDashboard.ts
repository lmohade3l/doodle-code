import { useQuery } from '@tanstack/react-query';
import { fetchExpiring, fetchNotifications, fetchSummary } from '../api/policies';

export function useDashboard() {
  const summary = useQuery({ queryKey: ['dashboard', 'summary'], queryFn: fetchSummary, staleTime: 60_000 });
  const expiring = useQuery({ queryKey: ['dashboard', 'expiring'], queryFn: fetchExpiring, staleTime: 60_000 });
  const notifications = useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: fetchNotifications,
    staleTime: 60_000,
  });
  return { summary, expiring, notifications };
}
