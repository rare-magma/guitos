import type { CsvImportResult } from "@guitos/contexts/budget/infrastructure/papaparseCsvBudgetRepository";

export interface CsvBudgetRepository {
  import(csv: string): CsvImportResult;
}
