import type { Query } from "@shared/domain/queryBus/query";
import type { Response } from "@shared/domain/queryBus/response";

export interface QueryHandler<Q extends Query, R extends Response> {
  subscribedTo(): Query;
  handle(query: Q): Promise<R>;
}
