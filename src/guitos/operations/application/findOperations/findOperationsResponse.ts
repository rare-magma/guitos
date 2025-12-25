import type { ItemOperation } from "@guitos/operations/domain/itemOperation";
import type { Primitives } from "@shared/domain/primitives";
import { Response } from "@shared/domain/queryBus/response";

export class FindOperationsResponse extends Response {
  readonly operations: Primitives<ItemOperation[]>;

  constructor({ operations }: Primitives<FindOperationsResponse>) {
    super();

    this.operations = operations;
  }
}
