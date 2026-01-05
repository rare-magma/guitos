import type { JsonBudgetRepository } from "@guitos/contexts/importExport/domain/jsonBudgetRepository";
import type { JsonImportResult } from "@guitos/contexts/importExport/infrastructure/jsonParseBudgetRepository";
import { expect, vi } from "vitest";

export class JsonBudgetRepositoryMock implements JsonBudgetRepository {
  private mockImport = vi.fn();

  import(json: string): JsonImportResult {
    this.mockImport(json);
    return {
      success: true,
      data: [],
      errors: null,
    };
  }

  assertImportHasBeenCalledWith(json: string): void {
    const { mock } = this.mockImport;
    const lastSavedExampleAggregate = mock.calls[mock.calls.length - 1][0];

    expect(lastSavedExampleAggregate).toStrictEqual(json);
  }
}
