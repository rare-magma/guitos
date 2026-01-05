import { BudgetChangedDomainEventMother } from "@guitos/contexts/budget/domain/budgetChangedDomainEvent.mother";
import { CsvBudgetImporter } from "@guitos/contexts/importExport/application/importBudget/csvBudgetImporter";
import { ImportBudgetCsvCommandMother } from "@guitos/contexts/importExport/application/importBudget/importBudgetCsvCommand.mother";
import { ImportBudgetCsvCommandHandler } from "@guitos/contexts/importExport/application/importBudget/importBudgetCsvCommandHandler";
import { CsvBudgetRepositoryMock } from "@guitos/contexts/importExport/domain/__mocks__/csvBudgetRepository.mock";
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
