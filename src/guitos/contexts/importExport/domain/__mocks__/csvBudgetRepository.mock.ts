import type { CsvBudgetRepository } from "@guitos/contexts/importExport/domain/csvBudgetRepository";
import type { CsvImportResult } from "@guitos/contexts/importExport/infrastructure/papaparseCsvBudgetRepository";
import { expect, vi } from "vitest";

export class CsvBudgetRepositoryMock implements CsvBudgetRepository {
  private mockImport = vi.fn();

  import(csv: string): CsvImportResult {
    this.mockImport(csv);
    return {
      success: true,
      data: [],
      errors: [],
    };
  }

  assertImportHasBeenCalledWith(csv: string): void {
    const { mock } = this.mockImport;
    const lastSavedExampleAggregate = mock.calls[mock.calls.length - 1][0];

    expect(lastSavedExampleAggregate).toStrictEqual(csv);
  }
}
