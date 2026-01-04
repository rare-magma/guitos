import { FindAllBudgetsResponse } from "@guitos/contexts/budget/application/readAllBudgets/findAllBudgetsResponse";
import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import type { Primitives } from "@shared/domain/primitives";

export class FindAllBudgetsResponseMother {
  static create(
    primitives: Primitives<FindAllBudgetsResponse>,
  ): FindAllBudgetsResponse {
    return new FindAllBudgetsResponse(primitives);
  }

  static random(
    overwrites?: Partial<Primitives<FindAllBudgetsResponse>>,
  ): FindAllBudgetsResponse {
    const budgets = [BudgetMother.random(), BudgetMother.random()];
    return FindAllBudgetsResponseMother.create({
      budgets: budgets.map((budget) => budget.toPrimitives()),
      ...overwrites,
    });
  }
}
