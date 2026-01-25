export type CreditStatus = 'EN_REVISION' | 'APROBADO' | 'RECHAZADO';

export interface CreditApplication {
  id: number;
  amount: number;
  termMonths: number;
  referenceRate: number;
  purpose: string;
  status: CreditStatus;
  createdAt: string; // ISO string
  creditProductName: string;
  currencyCode: string;

  // Campos útiles para el analista (ajusta a lo que te dé el backend)
  clientFullName?: string;
  analystComments?: string | null;
  lastUpdatedAt?: string | null;
}

// export interface CreditApplication {
//   id: number;
//   amount: number;
//   termMonths: number;
//   referenceRate: number;
//   purpose: string;
//   status: CreditStatus;
//   createdAt: string;
//   creditProductName: string;
//   currencyCode: string;
//   clientFullName?: string;
//   analystComments?: string | null;
//   lastUpdatedAt?: string | null;
// }


export interface CreateCreditRequest {
  amount: number;
  termMonths: number;
  referenceRate: number;
  purpose: string;
  creditProductId: number;
  currencyId: number;
  incomeSourceId: number;
}

export interface ChangeCreditStatusRequest {
  newStatus: CreditStatus;
  analystComments: string;
}

// 🔹 Page genérico (Spring Data Page)
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // página actual (0-based)
  size: number;
}

// 🔹 KPIs para el analista
export interface CreditKpiSummary {
  enRevisionCount: number;
  aprobadasCount: number;
  rechazadasCount: number;
  totalEnRevisionAmount: number;
  totalAprobadasAmount: number;
}