import type { Query } from "@shared/domain/queryBus/query";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";
import type { Response } from "@shared/domain/queryBus/response";

export interface QueryBus {
  ask<R extends Response>(query: Query): Promise<R>;
  register(queryHandler: QueryHandler<Query, Response>): void;
  unregister(queryHandler: QueryHandler<Query, Response>): void;
}
