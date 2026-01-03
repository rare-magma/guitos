import { CsvBudgetImporter } from "@guitos/contexts/budget/application/importBudget/csvBudgetImporter";
import { ImportBudgetCsvCommandMother } from "@guitos/contexts/budget/application/importBudget/importBudgetCsvCommand.mother";
import { ImportBudgetCsvCommandHandler } from "@guitos/contexts/budget/application/importBudget/importBudgetCsvCommandHandler";
import { CsvBudgetRepositoryMock } from "@guitos/contexts/budget/domain/__mocks__/csvBudgetRepository.mock";
import { EventBusMock } from "@shared/__mocks__/eventBus.mock";
import { describe, expect, it } from "vitest";

describe("CsvBudgetImporter", () => {
  it("should import valid budget csv", async () => {
    expect.hasAssertions();

    const repository = new CsvBudgetRepositoryMock();
    const eventBus = new EventBusMock();
    const handler = new ImportBudgetCsvCommandHandler(
      new CsvBudgetImporter(repository, eventBus),
    );
    const command = ImportBudgetCsvCommandMother.random();

    await handler.handle(command);

    repository.assertImportHasBeenCalledWith(command.csv);
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
