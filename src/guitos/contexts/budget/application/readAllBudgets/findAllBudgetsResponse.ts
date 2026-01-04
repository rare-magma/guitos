import type { Budget } from "@guitos/contexts/budget/domain/budget";
import type { Nullable } from "@shared/domain/nullable";
import type { Primitives } from "@shared/domain/primitives";
import { Response } from "@shared/domain/queryBus/response";

export class FindAllBudgetsResponse extends Response {
  readonly budgets: Nullable<Primitives<Budget[]>>;

  constructor({ budgets }: Primitives<FindAllBudgetsResponse>) {
    super();

    this.budgets = budgets;
  }
}
