import type { Query } from "@shared/domain/queryBus/query";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";
import { QueryNotRegisteredError } from "@shared/domain/queryBus/queryNotRegisteredError";
import type { Response } from "@shared/domain/queryBus/response";

export class QueryHandlersInformation {
  private queryHandlersMap: Map<Query, QueryHandler<Query, Response>>;

  constructor(queryHandlers: QueryHandler<Query, Response>[]) {
    this.queryHandlersMap = this.formatHandlers(queryHandlers);
  }

  private formatHandlers(
    queryHandlers: QueryHandler<Query, Response>[],
  ): Map<Query, QueryHandler<Query, Response>> {
    return queryHandlers.reduce(
      (map, queryHandler) => map.set(queryHandler.subscribedTo(), queryHandler),
      new Map<Query, QueryHandler<Query, Response>>(),
    );
  }

  public search(query: Query): QueryHandler<Query, Response> {
    const queryHandler = this.queryHandlersMap.get(query.constructor);

    if (!queryHandler) {
      throw new QueryNotRegisteredError(query);
    }

    return queryHandler;
  }
}
