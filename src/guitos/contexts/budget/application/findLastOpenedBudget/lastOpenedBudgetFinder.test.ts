import { LastOpenedBudgetFinder } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetFinder";
import { LastOpenedBudgetQuery } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetQuery";
import { LastOpenedBudgetQueryHandler } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetQueryHandler";
import { LastOpenedBudgetResponse } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetResponse";
import { LastOpenedBudgetResponseMother } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetResponse.mother";
import { LastOpenedBudgetRepositoryMock } from "@guitos/contexts/budget/domain/__mocks__/lastOpenedBudgetRepository.mock";
import { describe, expect, it } from "vitest";

describe("lastOpenedBudgetFinder", () => {
  it("should return nothing when there's none saved", async () => {
    expect.hasAssertions();

    const repository = new LastOpenedBudgetRepositoryMock();
    const handler = new LastOpenedBudgetQueryHandler(
      new LastOpenedBudgetFinder(repository),
    );
    const query = new LastOpenedBudgetQuery();

    repository.whenFindThenReturn(null);

    const actual = await handler.handle(query);

    expect(actual).toStrictEqual(new LastOpenedBudgetResponse({ name: null }));
  });

  it("should return the last opened budget name when there's one saved", async () => {
    expect.hasAssertions();

    const repository = new LastOpenedBudgetRepositoryMock();
    const handler = new LastOpenedBudgetQueryHandler(
      new LastOpenedBudgetFinder(repository),
    );
    const query = new LastOpenedBudgetQuery();
    const expected = LastOpenedBudgetResponseMother.random();

    repository.whenFindThenReturn(expected.name);

    const actual = await handler.handle(query);

    expect(actual).toStrictEqual(expected);
  });

  // TODO: is this necessary?
  // it("should publish an LastOpenedBudgetFoundDomainEvent", async () => {
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
