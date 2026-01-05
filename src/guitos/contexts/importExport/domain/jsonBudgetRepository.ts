import type { JsonImportResult } from "@guitos/contexts/importExport/infrastructure/jsonParseBudgetRepository";

export interface JsonBudgetRepository {
  import(json: string): JsonImportResult;
}
