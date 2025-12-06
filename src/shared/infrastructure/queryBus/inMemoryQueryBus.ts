import type { Query } from "@shared/domain/queryBus/query";
import type { QueryBus } from "@shared/domain/queryBus/queryBus";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";
import { QueryNotRegisteredError } from "@shared/domain/queryBus/queryNotRegisteredError";
import type { Response } from "@shared/domain/queryBus/response";
import { MultipleQueryHandlersError } from "@shared/infrastructure/queryBus/multipleQueryHandlersError";

export class InMemoryQueryBus implements QueryBus {
  private readonly handlers: Map<string, QueryHandler<Query, Response>> =
    new Map();

  async ask<R extends Response>(query: Query): Promise<R> {
    const handler = this.handlers.get(query.name);
    if (!handler) {
      throw new QueryNotRegisteredError(query);
    }

    const response = (await handler.handle(query)) as R;

    return response;
  }

  register<Q extends Query, R extends Response>(
    handler: QueryHandler<Q, R>,
  ): void {
    const query = handler.subscribedTo();
    const existingHandler = this.handlers.get(query.name);
    if (existingHandler) {
      if (existingHandler.constructor.name === handler.constructor.name) {
        return;
      }
      throw new MultipleQueryHandlersError(query.constructor.name);
    }
    this.handlers.set(query.name, handler);
  }

  unregister(handler: QueryHandler<Query, Response>): void {
    const query = handler.subscribedTo();
    this.handlers.delete(query.name);
  }
}
