import type { CsvRow } from "@guitos/application/react/budgetCsvService";
import type { CsvBudgetRepository } from "@guitos/contexts/budget/domain/csvBudgetRepository";
import Papa, { type ParseError } from "papaparse";

export type CsvImportResult = {
  success: boolean;
  data: CsvRow[];
  errors: ParseError[] | undefined;
};

export class PapaparseCsvBudgetRepository implements CsvBudgetRepository {
  import(csv: string): CsvImportResult {
    // biome-ignore lint/suspicious/noImplicitAnyLet: todo
    let csvObject;
    try {
      csvObject = Papa.parse(csv, {
        header: true,
        skipEmptyLines: "greedy",
      });

      return {
        success: true,
        data: csvObject.data as CsvRow[],
        errors: csvObject.errors,
      };
    } catch {
      return {
        success: false,
        data: [] as CsvRow[],
        errors: csvObject?.errors,
      };
    }
  }
}
