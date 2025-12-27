import type { Primitives } from "@shared/domain/primitives";
import { Response } from "@shared/domain/queryBus/response";

export class LastOpenedBudgetResponse extends Response {
  readonly name: string | null;

  constructor({ name }: Primitives<LastOpenedBudgetResponse>) {
    super();

    this.name = name;
  }
}
