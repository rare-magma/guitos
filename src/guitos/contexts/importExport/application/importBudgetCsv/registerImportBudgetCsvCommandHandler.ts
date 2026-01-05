import { CsvBudgetImporter } from "@guitos/contexts/importExport/application/importBudgetCsv/csvBudgetImporter";
import { ImportBudgetCsvCommandHandler } from "@guitos/contexts/importExport/application/importBudgetCsv/importBudgetCsvCommandHandler";
import { PapaparseCsvBudgetRepository } from "@guitos/contexts/importExport/infrastructure/papaparseCsvBudgetRepository";
import { commandBus, eventBus } from "@shared/infrastructure/buses";

export function registerImportBudgetCsvCommandHandler() {
  const importer = new CsvBudgetImporter(
    new PapaparseCsvBudgetRepository(),
    eventBus,
  );
  const commandHandler = new ImportBudgetCsvCommandHandler(importer);

  commandBus.register(commandHandler);
}
