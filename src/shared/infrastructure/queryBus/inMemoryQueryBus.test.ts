import { Query } from "@shared/domain/queryBus/query";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";
import { QueryNotRegisteredError } from "@shared/domain/queryBus/queryNotRegisteredError";
import type { Response } from "@shared/domain/queryBus/response";
import { InMemoryQueryBus } from "@shared/infrastructure/queryBus/inMemoryQueryBus";
import { QueryHandlersInformation } from "@shared/infrastructure/queryBus/queryHandlersInformation";
import { describe, expect, it } from "vitest";

class UnhandledQuery extends Query {
  static QUERY_NAME = "unhandled.query";
}

class HandledQuery extends Query {
  static QUERY_NAME = "handled.query";
}

class MyQueryHandler implements QueryHandler<Query, Response> {
  subscribedTo(): HandledQuery {
    return HandledQuery;
  }

  handle(_query: HandledQuery): Promise<Response> {
    return Promise.resolve({});
  }
}

describe("inMemoryQueryBus", () => {
  it("throws an error when no handlers are registered", async () => {
    expect.hasAssertions();

    const unhandledQuery = new UnhandledQuery();
    const queryBus = new InMemoryQueryBus();

    await expect(queryBus.ask(unhandledQuery)).rejects.toThrow(Error);
  });

  it("throws an error if dispatches a query without handler", async () => {
    expect.hasAssertions();

    const unhandledQuery = new UnhandledQuery();
    const queryHandlersInformation = new QueryHandlersInformation([]);
    const queryBus = new InMemoryQueryBus();

    queryBus.registerHandlers(queryHandlersInformation);

    await expect(queryBus.ask(unhandledQuery)).rejects.toThrow(
      QueryNotRegisteredError,
    );
  });

  it("accepts a query with handler", async () => {
    const handledQuery = new HandledQuery();
    const myQueryHandler = new MyQueryHandler();
    const queryHandlersInformation = new QueryHandlersInformation([
      myQueryHandler,
    ]);
    const queryBus = new InMemoryQueryBus();

    queryBus.registerHandlers(queryHandlersInformation);

    await queryBus.ask(handledQuery);
  });
});
