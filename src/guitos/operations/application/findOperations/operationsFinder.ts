import type { FindOperationsQuery } from "@guitos/operations/application/findOperations/findOperationsQuery";
import { FindOperationsResponse } from "@guitos/operations/application/findOperations/findOperationsResponse";
import { ItemOperation } from "@guitos/operations/domain/itemOperation";
import { MathOperation } from "@guitos/operations/domain/mathOperation";
import type { OperationsRepository } from "@guitos/operations/domain/operationsRepository";
import type { Primitives } from "@shared/domain/primitives";

export class OperationsFinder {
  private readonly repository: OperationsRepository;

  constructor(repository: OperationsRepository) {
    this.repository = repository;
  }

  async run({
    operationId,
  }: FindOperationsQuery): Promise<FindOperationsResponse> {
    const savedOperations = await this.repository.find(operationId);
    const operations: Primitives<ItemOperation[]> = [];

    if (!savedOperations) {
      return new FindOperationsResponse({ operations: [] });
    }

    for (const operation of savedOperations) {
      const newOperation = new ItemOperation(
        operation.id,
        operation.budgetItemId,
        operation.changeValue,
        new MathOperation(operation.mathOperation.name),
      );
      operations.push(newOperation.toPrimitives());
    }

    return new FindOperationsResponse({ operations });
  }
}
