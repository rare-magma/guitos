import { FindOperationsQuery } from "@guitos/contexts/operations/application/findOperations/findOperationsQuery";
import type { FindOperationsResponse } from "@guitos/contexts/operations/application/findOperations/findOperationsResponse";
import type { OperationsFinder } from "@guitos/contexts/operations/application/findOperations/operationsFinder";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";

export class FindOperationsQueryHandler
  implements QueryHandler<FindOperationsQuery, FindOperationsResponse>
{
  private readonly finder: OperationsFinder;

  constructor(finder: OperationsFinder) {
    this.finder = finder;
  }

  subscribedTo(): FindOperationsQuery {
    return FindOperationsQuery;
  }

  async handle(query: FindOperationsQuery): Promise<FindOperationsResponse> {
    const operationsResponse = await this.finder.run(query);
    return operationsResponse;
  }
}
