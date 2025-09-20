import type { Query } from "@shared/domain/queryBus/query";

export interface QueryBus {
  ask<R extends Response>(query: Query): Promise<R>;
}
