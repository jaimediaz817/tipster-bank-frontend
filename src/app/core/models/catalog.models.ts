export interface CreditProduct {
  id: number;
  name: string;
  // otros campos si el backend los expone, por ejemplo:
  // baseRate: number;
  // minTermMonths: number;
  // maxTermMonths: number;
}

export interface Currency {
  id: number;
  code: string;   // COP, USD, etc.
  name: string;   // Peso colombiano, Dólar, etc.
}

export interface IncomeSource {
  id: number;
  description: string; // Empleado, Independiente, etc.
}
