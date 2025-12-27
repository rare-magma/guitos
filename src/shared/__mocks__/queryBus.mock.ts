import type { Query } from "@shared/domain/queryBus/query";
import type { QueryBus } from "@shared/domain/queryBus/queryBus";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";
import type { Response } from "@shared/domain/queryBus/response";
import { expect, vi } from "vitest";
import { when } from "vitest-when";

export class QueryBusMock implements QueryBus {
  private mockAsk = vi.fn();

  ask<R extends Response>(query: Query): Promise<R> {
    return this.mockAsk(query) as Promise<R>;
  }

  whenAskThenReturn(response: Response): void {
    this.mockAsk.mockResolvedValue(response);
  }

  whenAskThenReturnBasedOn(map: Map<Response, Query>): void {
    map.forEach((response, query) => {
      if (response instanceof Error) {
        when(this.mockAsk).calledWith(query).thenReject(response);
      } else {
        when(this.mockAsk).calledWith(query).thenResolve(response);
      }
    });
  }

  whenAskThenReturnValueOnce(response: Response): void {
    this.mockAsk.mockResolvedValueOnce(response);
  }

  whenAskThenThrow(error: Error): void {
    this.mockAsk.mockRejectedValue(error);
  }

  assertAskHasBeenCalledWith(query: Query): void {
    expect(this.mockAsk).toHaveBeenLastCalledWith(query);
  }

  assertNothingAsked(): void {
    expect(this.mockAsk).not.toHaveBeenCalled();
  }

  register(queryHandler: QueryHandler<Query, Response>): void {
    throw new Error("Method not implemented.");
  }
  unregister(queryHandler: QueryHandler<Query, Response>): void {
    throw new Error("Method not implemented.");
  }
}
