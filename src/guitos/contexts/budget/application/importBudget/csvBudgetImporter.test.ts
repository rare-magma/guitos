import { CsvBudgetImporter } from "@guitos/contexts/budget/application/importBudget/csvBudgetImporter";
import { ImportBudgetCsvCommandMother } from "@guitos/contexts/budget/application/importBudget/importBudgetCsvCommand.mother";
import { ImportBudgetCsvCommandHandler } from "@guitos/contexts/budget/application/importBudget/importBudgetCsvCommandHandler";
import { CsvBudgetRepositoryMock } from "@guitos/contexts/budget/domain/__mocks__/csvBudgetRepository.mock";
import { BudgetChangedDomainEventMother } from "@guitos/contexts/budget/domain/budgetChangedDomainEvent.mother";
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

  it("should publish a BudgetChangedDomainEvent", async () => {
    expect.hasAssertions();

    const repository = new CsvBudgetRepositoryMock();
    const eventBus = new EventBusMock();
    const handler = new ImportBudgetCsvCommandHandler(
      new CsvBudgetImporter(repository, eventBus),
    );
    const command = ImportBudgetCsvCommandMother.random();
    const expected = BudgetChangedDomainEventMother.fromBudget(
      ImportBudgetCsvCommandMother.applyCommand(command),
    );

    await handler.handle(command);

    eventBus.assertLastPublishedEventIs(expected);
  });
});
