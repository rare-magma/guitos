import type { Query } from "@shared/domain/queryBus/query";

export class QueryNotRegisteredError extends Error {
  constructor(query: Query) {
    super(`<${query.constructor.name}> has no associated query handler`);
  }
}
