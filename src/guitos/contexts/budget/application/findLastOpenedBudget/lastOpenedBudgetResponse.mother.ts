import { LastOpenedBudgetResponse } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetResponse";
import { ObjectMother } from "@shared/domain/objectMother.mother";
import type { Primitives } from "@shared/domain/primitives";

export class LastOpenedBudgetResponseMother {
  static create(
    primitives: Primitives<LastOpenedBudgetResponse>,
  ): LastOpenedBudgetResponse {
    return new LastOpenedBudgetResponse(primitives);
  }

  static random(
    overwrites?: Partial<Primitives<LastOpenedBudgetResponse>>,
  ): LastOpenedBudgetResponse {
    const lastOpenedBudget = ObjectMother.word();
    return LastOpenedBudgetResponseMother.create({
      name: lastOpenedBudget,
      ...overwrites,
    });
  }
}
