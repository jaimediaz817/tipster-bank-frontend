export interface StatusSummary {
  status: string;
  count: number;
  totalAmount: number;
}

export interface CreditsSummary {
  totalCount: number;
  byStatus: StatusSummary[];
}