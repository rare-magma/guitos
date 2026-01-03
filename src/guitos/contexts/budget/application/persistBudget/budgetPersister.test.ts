import { BudgetPersister } from "@guitos/contexts/budget/application/persistBudget/budgetPersister";
import { PersistBudgetCommandMother } from "@guitos/contexts/budget/application/persistBudget/persistBudgetCommand.mother";
import { PersistBudgetCommandHandler } from "@guitos/contexts/budget/application/persistBudget/persistBudgetCommandHandler";
import { BudgetRepositoryMock } from "@guitos/contexts/budget/domain/__mocks__/budgetRepository.mock";
import { describe, expect, it } from "vitest";

describe("BudgetPersister", () => {
  it("should save a budget", async () => {
    expect.hasAssertions();

    const repository = new BudgetRepositoryMock();
    const handler = new PersistBudgetCommandHandler(
      new BudgetPersister(repository),
    );
    const command = PersistBudgetCommandMother.random();

    await handler.handle(command);

    repository.assertSaveHasBeenCalledWith(command.budget.id, command.budget);
  });

  // TODO: is this necessary?
  // it("should publish an UserPreferencesChangedDomainEvent", async () => {
  //   expect.hasAssertions();

  //   const clock = new ClockMock();
  //   const repository = new UserPreferencesRepositoryMock();
  //   const eventBus = new EventBusMock();
  //   const handler = new ChangeUserPreferencesCommandHandler(
  //     new UserPreferencesChanger(clock, repository, eventBus),
  //   );
  //   const command = ChangeUserPreferencesCommandMother.random();
  //   const createdAt = DatetimeMother.random();
  //   const expected =
  //     UserPreferencesChangedDomainEventMother.fromUserPreferences(
  //       ChangeUserPreferencesCommandMother.applyCommand(command, {
  //         createdAt,
  //       }),
  //     );

  //   clock.whenNowThenReturn(createdAt);
  //   repository.whenReadThenReturn(null);

  //   await handler.handle(command);

  //   eventBus.assertLastPublishedEventIs(expected);
  // });
});
