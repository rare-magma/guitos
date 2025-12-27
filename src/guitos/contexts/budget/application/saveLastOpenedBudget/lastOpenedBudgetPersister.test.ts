import { LastOpenedBudgetPersister } from "@guitos/contexts/budget/application/saveLastOpenedBudget/lastOpenedBudgetPersister";
import { PersistLastOpenedBudgetCommandMother } from "@guitos/contexts/budget/application/saveLastOpenedBudget/persistLastOpenedBudgetCommand.mother";
import { PersistLastOpenedBudgetCommandHandler } from "@guitos/contexts/budget/application/saveLastOpenedBudget/persistLastOpenedBudgetCommandHandler";
import { LastOpenedBudgetRepositoryMock } from "@guitos/contexts/budget/domain/__mocks__/lastOpenedBudgetRepository.mock";
import { describe, expect, it } from "vitest";

describe("lastOpenedBudgetPersister", () => {
  it("should save valid budget name", async () => {
    expect.hasAssertions();

    const repository = new LastOpenedBudgetRepositoryMock();
    const handler = new PersistLastOpenedBudgetCommandHandler(
      new LastOpenedBudgetPersister(repository),
    );
    const command = PersistLastOpenedBudgetCommandMother.random();

    await handler.handle(command);

    repository.assertSaveHasBeenCalledWith(command.budgetName);
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
