import { BudgetsFinder } from "@guitos/contexts/budget/application/readAllBudgets/allBudgetsFinder";
import { FindAllBudgetsQuery } from "@guitos/contexts/budget/application/readAllBudgets/findAllBudgetsQuery";
import { FindAllBudgetsQueryHandler } from "@guitos/contexts/budget/application/readAllBudgets/findAllBudgetsQueryHandler";
import { FindAllBudgetsResponse } from "@guitos/contexts/budget/application/readAllBudgets/findAllBudgetsResponse";
import { FindAllBudgetsResponseMother } from "@guitos/contexts/budget/application/readAllBudgets/findAllBudgetsResponse.mother";
import { BudgetRepositoryMock } from "@guitos/contexts/budget/domain/__mocks__/budgetRepository.mock";
import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import { describe, expect, it } from "vitest";

describe("AllBudgetsFinder", () => {
  it("should return nothing when there's none saved", async () => {
    expect.hasAssertions();

    const repository = new BudgetRepositoryMock();
    const handler = new FindAllBudgetsQueryHandler(
      new BudgetsFinder(repository),
    );
    const query = new FindAllBudgetsQuery();

    repository.whenFindThenReturn({ budget: null });

    const actual = await handler.handle(query);

    expect(actual).toStrictEqual(new FindAllBudgetsResponse({ budgets: [] }));
  });

  it("should return all the budgets when there's some saved", async () => {
    expect.hasAssertions();

    const repository = new BudgetRepositoryMock();
    const handler = new FindAllBudgetsQueryHandler(
      new BudgetsFinder(repository),
    );
    const randomBudgets = [BudgetMother.random(), BudgetMother.random()];
    const query = new FindAllBudgetsQuery();
    const expected = FindAllBudgetsResponseMother.random({
      budgets: randomBudgets.map((budget) => budget.toPrimitives()),
    });

    repository.whenFindThenReturn(expected);

    const actual = await handler.handle(query);

    expect(actual).toStrictEqual(expected);
  });
});
