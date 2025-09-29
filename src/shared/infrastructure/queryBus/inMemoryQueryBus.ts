import type { Query } from "@shared/domain/queryBus/query";
import type { QueryBus } from "@shared/domain/queryBus/queryBus";
import type { Response } from "@shared/domain/queryBus/response";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";
import { MultipleQueryHandlersError } from "@shared/infrastructure/queryBus/multipleQueryHandlersError";
import { QueryNotRegisteredError } from "@shared/domain/queryBus/queryNotRegisteredError";

export class InMemoryQueryBus implements QueryBus {
  private readonly handlers: Map<string, QueryHandler<Query, Response>> =
    new Map();

  async ask<R extends Response>(query: Query): Promise<R> {
    const handler = this.handlers.get(query.queryName);
    if (!handler) {
      throw new QueryNotRegisteredError(query);
    }

    const response = (await handler.handle(query)) as R;

    return response;
  }

  register<Q extends Query, R extends Response>(
    handler: QueryHandler<Q, R>,
  ): void {
    const { queryName } = handler.subscribedTo();
    const existingHandler = this.handlers.get(queryName);
    if (existingHandler) {
      if (existingHandler.constructor.name === handler.constructor.name) {
        return;
      }
      throw new MultipleQueryHandlersError(queryName);
    }
    this.handlers.set(queryName, handler);
  }

  unregister(handler: QueryHandler<Query, Response>): void {
    const { queryName } = handler.subscribedTo();
    this.handlers.delete(queryName);
  }
}
