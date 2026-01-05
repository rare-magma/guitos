import { BudgetChangedDomainEventMother } from "@guitos/contexts/budget/domain/budgetChangedDomainEvent.mother";
import { ImportBudgetJsonCommandMother } from "@guitos/contexts/importExport/application/importBudgetJson/importBudgetJsonCommand.mother";
import { ImportBudgetJsonCommandHandler } from "@guitos/contexts/importExport/application/importBudgetJson/importBudgetJsonCommandHandler";
import { JsonBudgetImporter } from "@guitos/contexts/importExport/application/importBudgetJson/jsonBudgetImporter";
import { JsonBudgetRepositoryMock } from "@guitos/contexts/importExport/domain/__mocks__/jsonBudgetRepository.mock";
import { EventBusMock } from "@shared/__mocks__/eventBus.mock";
import { describe, expect, it } from "vitest";

describe("JsonBudgetImporter", () => {
  it("should import valid budget json", async () => {
    expect.hasAssertions();

    const repository = new JsonBudgetRepositoryMock();
    const eventBus = new EventBusMock();
    const handler = new ImportBudgetJsonCommandHandler(
      new JsonBudgetImporter(repository, eventBus),
    );
    const command = ImportBudgetJsonCommandMother.random();

    await handler.handle(command);

    repository.assertImportHasBeenCalledWith(command.json);
  });

  it("should publish a BudgetChangedDomainEvent", async () => {
    expect.hasAssertions();

    const repository = new JsonBudgetRepositoryMock();
    const eventBus = new EventBusMock();
    const handler = new ImportBudgetJsonCommandHandler(
      new JsonBudgetImporter(repository, eventBus),
    );
    const command = ImportBudgetJsonCommandMother.random();
    const expected = BudgetChangedDomainEventMother.fromBudget(
      ImportBudgetJsonCommandMother.applyCommand(command),
    );

    await handler.handle(command);

    eventBus.assertLastPublishedEventIs(expected);
  });
});
