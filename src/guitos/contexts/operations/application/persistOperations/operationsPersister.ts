import { FindOperationsQuery } from "@guitos/contexts/operations/application/findOperations/findOperationsQuery";
import type { FindOperationsResponse } from "@guitos/contexts/operations/application/findOperations/findOperationsResponse";
import type { PersistOperationsCommand } from "@guitos/contexts/operations/application/persistOperations/persistOperationsCommand";
import { ItemOperation } from "@guitos/contexts/operations/domain/itemOperation";
import { MathOperation } from "@guitos/contexts/operations/domain/mathOperation";
import type { OperationsRepository } from "@guitos/contexts/operations/domain/operationsRepository";
import type { Clock } from "@shared/domain/clock";
import type { EventBus } from "@shared/domain/eventBus/eventBus";
import type { QueryBus } from "@shared/domain/queryBus/queryBus";

export class OperationsPersister {
  private readonly clock: Clock;
  private readonly repository: OperationsRepository;
  private readonly eventBus: EventBus;
  private readonly queryBus: QueryBus;

  constructor(
    clock: Clock,
    repository: OperationsRepository,
    eventBus: EventBus,
    queryBus: QueryBus,
  ) {
    this.clock = clock;
    this.repository = repository;
    this.eventBus = eventBus;
    this.queryBus = queryBus;
  }

  async run({ id, operations }: PersistOperationsCommand): Promise<void> {
    const { operations: existingOperations } =
      await this.queryBus.ask<FindOperationsResponse>(
        new FindOperationsQuery(id),
      );
    const allOperations = [...existingOperations, ...operations];
    await this.repository.update(id, allOperations);

    for (const operation of allOperations) {
      const newOperation = new ItemOperation(
        operation.id,
        operation.budgetItemId,
        operation.changeValue,
        new MathOperation(operation.mathOperation.name),
        this.clock.now(),
      );
      await this.eventBus.publish(newOperation.pullDomainEvents());
    }
  }
}
