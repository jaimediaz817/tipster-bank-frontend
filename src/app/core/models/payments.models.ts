export interface PaymentSimulationRequest {
  amount: number;
  termMonths: number;
  annualRate: number; // 0.18 = 18%
}

export interface PaymentInstallment {
  installmentNumber: number;
  dueDate: string; // ISO
  principal: number;
  interest: number;
  total: number;
  remainingBalance: number;
}
