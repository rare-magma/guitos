import { FindBudgetResponse } from "@guitos/contexts/budget/application/readBudget/findBudgetResponse";
import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import type { Primitives } from "@shared/domain/primitives";

export class FindBudgetResponseMother {
  static create(
    primitives: Primitives<FindBudgetResponse>,
  ): FindBudgetResponse {
    return new FindBudgetResponse(primitives);
  }

  static random(
    overwrites?: Partial<Primitives<FindBudgetResponse>>,
  ): FindBudgetResponse {
    const budget = BudgetMother.random();
    return FindBudgetResponseMother.create({
      budget: budget.toPrimitives(),
      ...overwrites,
    });
  }
}
