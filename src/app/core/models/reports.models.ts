export interface DetailedPortfolioReport {
  applicationId: number;
  clientId: number;
  clientFullName: string;
  clientEmail: string;
  productName: string;
  currencyCode: string;
  amount: number;
  termMonths: number;
  status: string;
  createdAt: string;
  lastUpdatedAt: string | null;
  incomeSource: string;
  analystComments: string | null;
}

export interface ClientExposureReport {
  clientId: number;
  clientFullName: string;
  clientEmail: string;
  productId: number;
  productName: string;
  applicationsCount: number;
  totalApprovedAmount: number;
  simulatedTotalToPay: number;
  averageInstallmentAmount: number;
}