import type { FindOperationsQuery } from "@guitos/contexts/operations/application/findOperations/findOperationsQuery";
import { FindOperationsResponse } from "@guitos/contexts/operations/application/findOperations/findOperationsResponse";
import { ItemOperation } from "@guitos/contexts/operations/domain/itemOperation";
import { MathOperation } from "@guitos/contexts/operations/domain/mathOperation";
import type { OperationsRepository } from "@guitos/contexts/operations/domain/operationsRepository";
import { Datetime } from "@shared/domain/datetime";
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
        new Datetime(operation.createdAt),
      );
      operations.push(newOperation.toPrimitives());
    }

    return new FindOperationsResponse({ operations });
  }
}
