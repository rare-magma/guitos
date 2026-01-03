import type { Budget } from "@guitos/contexts/budget/domain/budget";
import type { Nullable } from "@shared/domain/nullable";
import type { Primitives } from "@shared/domain/primitives";
import { Response } from "@shared/domain/queryBus/response";

export class FindBudgetResponse extends Response {
  readonly budget: Nullable<Primitives<Budget>>;

  constructor({ budget }: Primitives<FindBudgetResponse>) {
    super();

    this.budget = budget;
  }
}
