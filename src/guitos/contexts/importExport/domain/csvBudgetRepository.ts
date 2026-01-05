import type { CsvImportResult } from "@guitos/contexts/importExport/infrastructure/papaparseCsvBudgetRepository";

export interface CsvBudgetRepository {
  import(csv: string): CsvImportResult;
}
