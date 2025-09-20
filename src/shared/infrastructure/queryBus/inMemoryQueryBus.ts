import type { Query } from "@shared/domain/queryBus/query";
import type { QueryBus } from "@shared/domain/queryBus/queryBus";
import type { QueryHandlersInformation } from "@shared/infrastructure/queryBus/queryHandlersInformation";

export class InMemoryQueryBus implements QueryBus {
  private queryHandlersInformation?: QueryHandlersInformation;

  registerHandlers(queryHandlersInformation: QueryHandlersInformation): void {
    this.queryHandlersInformation = queryHandlersInformation;
  }

  async ask<R extends Response>(query: Query): Promise<R> {
    if (!this.queryHandlersInformation) {
      throw new Error("No query handlers registered");
    }

    const handler = this.queryHandlersInformation.search(query);
    const response = (await handler.handle(query)) as R;

    return response;
  }
}
