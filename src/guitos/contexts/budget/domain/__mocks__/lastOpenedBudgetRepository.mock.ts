import type { LastOpenedBudgetRepository } from "@guitos/contexts/budget/domain/lastOpenedBudgetRepository";
import type { Nullable } from "@shared/domain/nullable";
import { expect, vi } from "vitest";

export class LastOpenedBudgetRepositoryMock
  implements LastOpenedBudgetRepository
{
  private mockSave = vi.fn();
  private mockFind = vi.fn();

  save(name: string): boolean {
    this.mockSave(name);
    return true;
  }

  assertSaveHasBeenCalledWith(name: string): void {
    const { mock } = this.mockSave;
    const lastSavedExampleAggregate = mock.calls[mock.calls.length - 1][0];

    expect(lastSavedExampleAggregate).toStrictEqual(name);
  }

  find(): Nullable<string> {
    return this.mockFind();
  }

  whenFindThenReturn(name: Nullable<string>): void {
    this.mockFind.mockReturnValue(name);
  }
}
