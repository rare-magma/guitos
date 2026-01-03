import type { Budget } from "@guitos/contexts/budget/domain/budget";
import type { BudgetRepository } from "@guitos/contexts/budget/domain/budgetRepository";
import type { Nullable } from "@shared/domain/nullable";
import type { Primitives } from "@shared/domain/primitives";
import type { Uuid } from "@shared/domain/uuid";
import { expect, vi } from "vitest";

export class BudgetRepositoryMock implements BudgetRepository {
  private mockFind = vi.fn();
  private mockFindAll = vi.fn();
  private mockSave = vi.fn();
  private mockDelete = vi.fn();

  save(id: Primitives<Uuid>, newBudget: Primitives<Budget>): Promise<boolean> {
    this.mockSave(id, newBudget);
    return Promise.resolve(true);
  }

  assertSaveHasBeenCalledWith(
    id: Primitives<Uuid>,
    newBudget: Primitives<Budget>,
  ): void {
    const { mock } = this.mockSave;
    const lastSavedExampleAggregate = mock.calls[mock.calls.length - 1][0];

    expect(lastSavedExampleAggregate).toStrictEqual(newBudget);
  }

  find(id: Primitives<Uuid>): Promise<Primitives<Budget>> {
    return this.mockFind(id);
  }

  whenFindThenReturn(budget: Primitives<Nullable<Budget>>): void {
    this.mockFind.mockReturnValue(budget);
  }

  findAll(): Promise<Primitives<Budget[]>> {
    return this.mockFindAll();
  }

  whenFindAllThenReturn(budgets: Primitives<Budget[]>): void {
    this.mockFind.mockReturnValue(budgets);
  }

  delete(id: Primitives<Uuid>): Promise<boolean> {
    this.mockDelete(id);
    return Promise.resolve(true);
  }

  assertDeleteHasBeenCalledWith(id: Primitives<Uuid>): void {
    const { mock } = this.mockSave;
    const lastSavedExampleAggregate = mock.calls[mock.calls.length - 1][0];

    expect(lastSavedExampleAggregate).toStrictEqual(id);
  }
}
