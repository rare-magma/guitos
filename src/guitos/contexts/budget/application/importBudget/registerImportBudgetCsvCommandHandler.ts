import { CsvBudgetImporter } from "@guitos/contexts/budget/application/importBudget/csvBudgetImporter";
import { ImportBudgetCsvCommandHandler } from "@guitos/contexts/budget/application/importBudget/importBudgetCsvCommandHandler";
import { PapaparseCsvBudgetRepository } from "@guitos/contexts/budget/infrastructure/papaparseCsvBudgetRepository";
import { commandBus, eventBus } from "@shared/infrastructure/buses";

export function registerImportBudgetCsvCommandHandler() {
  const importer = new CsvBudgetImporter(
    new PapaparseCsvBudgetRepository(),
    eventBus,
  );
  const commandHandler = new ImportBudgetCsvCommandHandler(importer);

  commandBus.register(commandHandler);
}
