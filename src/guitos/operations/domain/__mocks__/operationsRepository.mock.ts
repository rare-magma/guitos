import { ItemOperation } from "@guitos/operations/domain/itemOperation";
import type { OperationsRepository } from "@guitos/operations/domain/operationsRepository";
import type { Nullable } from "@shared/domain/nullable";
import type { Primitives } from "@shared/domain/primitives";
import { expect, vi } from "vitest";

export class OperationsRepositoryMock implements OperationsRepository {
  private mockGet = vi.fn();
  private mockGetAll = vi.fn();
  private mockUpdate = vi.fn();
  private mockDelete = vi.fn();

  async find(id: string): Promise<Nullable<Primitives<ItemOperation[]>>> {
    return await this.mockGet(id);
  }

  whenGetThenReturn(
    itemOperations: Nullable<Primitives<ItemOperation[]>>,
  ): void {
    this.mockGet.mockResolvedValue(itemOperations);
  }

  async findAll(): Promise<Nullable<Primitives<ItemOperation[][]>>> {
    return await this.mockGetAll();
  }

  whenGetAllThenReturn(
    itemsOperations: Nullable<Primitives<ItemOperation[][]>>,
  ): void {
    this.mockGetAll.mockResolvedValue(itemsOperations);
  }

  async update(
    id: string,
    itemOperations: Primitives<ItemOperation[]>,
  ): Promise<boolean> {
    return await this.mockUpdate(id, itemOperations);
  }

  assertUpdateHasBeenCalledWith(itemOperations: ItemOperation[]): void {
    const { mock } = this.mockUpdate;
    const lastSavedExampleAggregate = mock.calls[mock.calls.length - 1][1];
    for (const operation of itemOperations) {
      const expectedBody = operation.toPrimitives();
      const lastSavedExampleAggregateBody = lastSavedExampleAggregate;

      expect(lastSavedExampleAggregate).toBeInstanceOf(ItemOperation);
      expect(lastSavedExampleAggregateBody).toStrictEqual([expectedBody]);
    }
  }

  async delete(id: string): Promise<boolean> {
    return await this.mockDelete(id);
  }

  assertDeleteHasBeenCalledWith(id: string): void {
    const { mock } = this.mockDelete;
    const lastDeletedExampleAggregate = mock.calls[mock.calls.length - 1][0];
    const lastDeletedExampleAggregateBody =
      lastDeletedExampleAggregate.toPrimitives();
    expect(lastDeletedExampleAggregate).toBeInstanceOf(ItemOperation);
    expect(lastDeletedExampleAggregateBody).toStrictEqual(id);
  }
}
