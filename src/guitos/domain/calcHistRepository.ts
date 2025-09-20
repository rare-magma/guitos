import type { CalculationHistoryItem } from "@guitos/domain/calculationHistoryItem";

export interface CalcHistRepository {
  get(id: string): Promise<CalculationHistoryItem[] | null>;
  getAll(): Promise<CalculationHistoryItem[][] | null>;
  update(id: string, newCalcHist: CalculationHistoryItem[]): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
