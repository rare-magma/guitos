import { ItemOperationCreatedDomainEvent } from "@guitos/operations/domain/itemOperationCreatedDomainEvent";
import { MathOperation } from "@guitos/operations/domain/mathOperation";
import { AggregateRoot } from "@shared/domain/aggregateRoot";
import type { Primitives } from "@shared/domain/primitives";

export class ItemOperation extends AggregateRoot {
  id: string;
  budgetItemId: string;
  changeValue: number;
  mathOperation: MathOperation;

  constructor(
    id: string,
    budgetItemId: string,
    changeValue: number,
    mathOperation: MathOperation,
  ) {
    super();

    this.id = id;
    this.budgetItemId = budgetItemId;
    this.changeValue = changeValue;
    this.mathOperation = mathOperation;
  }

  static create(
    id: string,
    budgetItemId: string,
    changeValue: number,
    mathOperation: Primitives<MathOperation>,
  ): ItemOperation {
    const operation = new ItemOperation(
      id,
      budgetItemId,
      changeValue,
      new MathOperation(mathOperation.name),
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
  ): ItemOperation {
    return new ItemOperation(
      id,
      budgetItemId,
      changeValue,
      new MathOperation(mathOperation.name),
    );
  }

  toPrimitives(): Primitives<ItemOperation> {
    return {
      id: this.id,
      budgetItemId: this.budgetItemId,
      changeValue: this.changeValue,
      mathOperation: this.mathOperation.toPrimitives(),
    };
  }
}
