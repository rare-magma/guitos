import { ItemOperationCreatedDomainEvent } from "@guitos/operations/domain/itemOperationCreatedDomainEvent";
import { MathOperation } from "@guitos/operations/domain/mathOperation";
import { AggregateRoot } from "@shared/domain/aggregateRoot";
import { Datetime } from "@shared/domain/datetime";
import type { Primitives } from "@shared/domain/primitives";

export class ItemOperation extends AggregateRoot {
  id: string;
  budgetItemId: string;
  changeValue: number;
  mathOperation: MathOperation;
  createdAt?: Datetime;

  constructor(
    id: string,
    budgetItemId: string,
    changeValue: number,
    mathOperation: MathOperation,
    createdAt: Datetime,
  ) {
    super();

    this.id = id;
    this.budgetItemId = budgetItemId;
    this.changeValue = changeValue;
    this.mathOperation = mathOperation;
    this.createdAt = createdAt;
  }

  static create(
    id: string,
    budgetItemId: string,
    changeValue: number,
    mathOperation: Primitives<MathOperation>,
    createdAt: string,
  ): ItemOperation {
    const operation = new ItemOperation(
      id,
      budgetItemId,
      changeValue,
      new MathOperation(mathOperation.name),
      new Datetime(createdAt),
    );

    operation.record(
      new ItemOperationCreatedDomainEvent(operation.toPrimitives()),
    );

    return operation;
  }

  static fromPrimitives(
    id: string,
    budgetItemId: string,
    changeValue: number,
    mathOperation: Primitives<MathOperation>,
    createdAt: string,
  ): ItemOperation {
    return new ItemOperation(
      id,
      budgetItemId,
      changeValue,
      new MathOperation(mathOperation.name),
      new Datetime(createdAt),
    );
  }

  toPrimitives(): Primitives<ItemOperation> {
    return {
      id: this.id,
      budgetItemId: this.budgetItemId,
      changeValue: this.changeValue,
      mathOperation: this.mathOperation.toPrimitives(),
      createdAt: this.createdAt?.value ?? new Datetime().value,
    };
  }
}
