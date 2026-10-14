export type User = { id: string; name: string };

export type PolicyType = 'CAR' | 'HEALTH' | 'TRAVEL' | 'HOME';
export type PolicyStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING_PAYMENT';

export type Installment = { n: number; dueDate: string; amount: number; paid: boolean };

export type PolicyListItem = {
  id: string;
  number: string;
  type: PolicyType;
  title: string;
  insurer: string;
  status: PolicyStatus;
  premium: number;
  startDate: string;
  endDate: string;
  nextDue: Installment | null;
  unpaidCount: number;
};

export type PolicyDetail = Omit<PolicyListItem, 'nextDue' | 'unpaidCount'> & {
  installments: Installment[];
};

export type PoliciesPage = {
  items: PolicyListItem[];
  page: number;
  totalPages: number;
  total: number;
};

export type DashboardSummary = { active: number; pendingPayment: number; unpaidTotal: number };
export type Notification = { id: string; text: string };

export type TravelPolicy = {
  number: string;
  startDate: string;
  destination: string;
  passengers: { fullName: string; birthDate: string; passportNo: string }[];
  premium: number;
};
