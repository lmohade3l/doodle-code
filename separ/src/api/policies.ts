import { client } from './client';
import type {
  DashboardSummary,
  Notification,
  PoliciesPage,
  PolicyDetail,
  PolicyListItem,
  TravelPolicy,
} from '../types';

export type PolicyFilters = { status: string; sort: string; q: string; page: number };

export async function fetchPolicies(filters: PolicyFilters) {
  const { data } = await client.get<PoliciesPage>('/policies', { params: filters });
  return data;
}

export async function fetchPolicy(id: string) {
  const { data } = await client.get<PolicyDetail>(`/policies/${id}`);
  return data;
}

export async function payInstallment(policyId: string, n: number) {
  const { data } = await client.post(`/policies/${policyId}/installments/${n}/pay`);
  return data;
}

export async function fetchSummary() {
  const { data } = await client.get<DashboardSummary>('/dashboard/summary');
  return data;
}

export async function fetchExpiring() {
  const { data } = await client.get<PolicyListItem[]>('/dashboard/expiring');
  return data;
}

export async function fetchNotifications() {
  const { data } = await client.get<Notification[]>('/dashboard/notifications');
  return data;
}

export type TravelRequest = {
  destination: string;
  startDate: string;
  passengers: { fullName: string; birthDate: string; passportNo: string }[];
};

export async function createTravelPolicy(body: TravelRequest) {
  const { data } = await client.post<TravelPolicy>('/travel-policies', body);
  return data;
}
