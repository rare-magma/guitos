import { BudgetFinder } from "@guitos/contexts/budget/application/readBudget/budgetFinder";
import { FindBudgetQuery } from "@guitos/contexts/budget/application/readBudget/findBudgetQuery";
import { FindBudgetQueryHandler } from "@guitos/contexts/budget/application/readBudget/findBudgetQueryHandler";
import { FindBudgetResponse } from "@guitos/contexts/budget/application/readBudget/findBudgetResponse";
import { FindBudgetResponseMother } from "@guitos/contexts/budget/application/readBudget/findBudgetResponse.mother";
import { BudgetRepositoryMock } from "@guitos/contexts/budget/domain/__mocks__/budgetRepository.mock";
import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import { ObjectMother } from "@shared/domain/objectMother.mother";
import { describe, expect, it } from "vitest";

describe("BudgetFinder", () => {
  it("should return nothing when there's none saved", async () => {
    expect.hasAssertions();

    const repository = new BudgetRepositoryMock();
    const handler = new FindBudgetQueryHandler(new BudgetFinder(repository));
    const budgetId = ObjectMother.uuid();
    const query = new FindBudgetQuery(budgetId.value);

    repository.whenFindThenReturn({ budget: null });

    const actual = await handler.handle(query);

    expect(actual).toStrictEqual(new FindBudgetResponse({ budget: null }));
  });

  it("should return the budget when there's one saved", async () => {
    expect.hasAssertions();

    const repository = new BudgetRepositoryMock();
    const handler = new FindBudgetQueryHandler(new BudgetFinder(repository));
    const randomBudget = BudgetMother.random();
    const query = new FindBudgetQuery(randomBudget.id.value);
    const expected = FindBudgetResponseMother.random({
      budget: randomBudget.toPrimitives(),
    });

    repository.whenFindThenReturn(expected);

    const actual = await handler.handle(query);

    expect(actual).toStrictEqual(expected);
  });

  // TODO: is this necessary?
  // it("should publish an BudgetFoundDomainEvent", async () => {
  //   expect.hasAssertions();

  //   const repository = new LastOpenedBudgetRepositoryMock();
  //   const eventBus = new EventBusMock();
  //   const handler = new LastOpenedBudgetQueryHandler(
  //     new LastOpenedBudgetFinder(repository),
  //   );
  //   const query = new LastOpenedBudgetQuery();
  //   const expected = LastOpenedBudgetFoundDomainEventMother.random();

  //   await handler.handle(query);

  //   eventBus.assertLastPublishedEventIs(expected);
  // });
});
