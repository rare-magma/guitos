import { Query } from "@shared/domain/queryBus/query";

export class FindOperationsQuery extends Query {
  static readonly name = "guitos.operations.find.1";
  readonly operationId: string;

  constructor(operationId: string) {
    super(FindOperationsQuery.name);
    this.operationId = operationId;
  }
}
