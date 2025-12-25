import { Query } from "@shared/domain/queryBus/query";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";
import { QueryNotRegisteredError } from "@shared/domain/queryBus/queryNotRegisteredError";
import { Response } from "@shared/domain/queryBus/response";
import { InMemoryQueryBus } from "@shared/infrastructure/queryBus/inMemoryQueryBus";
import { MultipleQueryHandlersError } from "@shared/infrastructure/queryBus/multipleQueryHandlersError";
import { describe, expect, it } from "vitest";

class UnhandledQuery extends Query {
  static readonly name = "unhandled";
  constructor() {
    super(UnhandledQuery.name);
  }
}

class HandledQuery extends Query {
  static readonly name = "handled";
  constructor() {
    super(HandledQuery.name);
  }
}

class MyQueryResponse extends Response {}

class MyQueryHandler implements QueryHandler<Query, MyQueryResponse> {
  subscribedTo(): HandledQuery {
    return HandledQuery;
  }

  handle(_query: HandledQuery): Promise<MyQueryResponse> {
    return Promise.resolve(new MyQueryResponse());
  }
}

class AnotherQueryHandler implements QueryHandler<Query, Response> {
  subscribedTo(): HandledQuery {
    return HandledQuery;
  }

  handle(_query: HandledQuery): Promise<Response> {
    return Promise.resolve({});
  }
}

describe("inMemoryQueryBus", () => {
  describe("ask()", () => {
    it("throws an error when no handlers are registered", async () => {
      expect.hasAssertions();

      const unhandledQuery = new UnhandledQuery();
      const queryBus = new InMemoryQueryBus();

      await expect(queryBus.ask(unhandledQuery)).rejects.toThrow(Error);
    });

    it("throws an error if dispatches a query without handler", async () => {
      expect.hasAssertions();

      const unhandledQuery = new UnhandledQuery();
      const queryBus = new InMemoryQueryBus();

      await expect(queryBus.ask(unhandledQuery)).rejects.toThrow(
        QueryNotRegisteredError,
      );
    });

    it("replies with a response when asking a query that has a handler", async () => {
      const handledQuery = new HandledQuery();
      const myQueryHandler = new MyQueryHandler();
      const expected = new MyQueryResponse();
      const queryBus = new InMemoryQueryBus();

      queryBus.register(myQueryHandler);

      const actual = await queryBus.ask(handledQuery);
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("register()", () => {
    it("throws an error when more than one handler is registered for the same query", () => {
      const queryHandler = new MyQueryHandler();
      const anotherHandler = new AnotherQueryHandler();
      const queryBus = new InMemoryQueryBus();
      queryBus.register(queryHandler);
      expect(() => queryBus.register(anotherHandler)).toThrow(
        MultipleQueryHandlersError,
      );
    });

    it("should do nothing if a handler is already registered", () => {
      const queryHandler = new MyQueryHandler();
      const queryBus = new InMemoryQueryBus();
      queryBus.register(queryHandler);
      expect(() => queryBus.register(queryHandler)).not.toThrow();
    });

    it("should register a query handler", () => {
      const queryHandler = new MyQueryHandler();
      const queryBus = new InMemoryQueryBus();
      expect(() => queryBus.register(queryHandler)).not.toThrow();
    });
  });

  describe("unregister()", () => {
    it("should do nothing when unregistering a handler that is not registered", () => {
      const queryHandler = new MyQueryHandler();
      const queryBus = new InMemoryQueryBus();
      expect(() => queryBus.unregister(queryHandler)).not.toThrow();
    });

    it("should unregister a query handler", () => {
      const queryHandler = new MyQueryHandler();
      const queryBus = new InMemoryQueryBus();
      queryBus.register(queryHandler);
      expect(() => queryBus.unregister(queryHandler)).not.toThrow();
    });
  });
});
