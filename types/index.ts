export type PaymentStatus = "Paid" | "Pending" | "Overdue";
export type MemberRole = "Member" | "Officer" | "Commander";
export type PaymentMethod = "Transfer" | "Cash" | "Other";

export interface Member {
  id: string;
  name: string;
  tag?: string | null;
  role: MemberRole;
  joined_at: string;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
  total_paid?: number;
  total_pending?: number;
  payment_count?: number;
  last_payment_date?: string | null;
}

export interface Payment {
  id: string;
  member_id?: string | null;
  member_name: string;
  amount: number;
  payment_date: string;
  due_date?: string | null;
  status: PaymentStatus;
  transaction_ref?: string | null;
  payment_method: PaymentMethod;
  notes?: string | null;
  receipt_url?: string | null;
  receipt_path?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  action: "payment_added" | "payment_updated" | "payment_deleted" | string;
  member_name?: string | null;
  amount?: number | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface DashboardStats {
  totalCollected: number;
  totalOutstanding: number;
  totalOverdue: number;
  memberCount: number;
  activeMembers: number;
  paymentCount: number;
  collectionRate: number;
  thisMonthCollected: number;
  collectionTrend: number[];
}

export interface PaymentFilters {
  search?: string;
  status?: PaymentStatus | "All";
  method?: PaymentMethod | "All";
  dateFrom?: string;
  dateTo?: string;
  sortBy?: "payment_date" | "amount" | "member_name" | "created_at";
  sortDir?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PaymentsResponse {
  data: Payment[];
  total: number;
  page: number;
  totalPages: number;
}
