import { ImportBudgetJsonCommandHandler } from "@guitos/contexts/importExport/application/importBudgetJson/importBudgetJsonCommandHandler";
import { JsonBudgetImporter } from "@guitos/contexts/importExport/application/importBudgetJson/jsonBudgetImporter";
import { JsonParseBudgetRepository } from "@guitos/contexts/importExport/infrastructure/jsonParseBudgetRepository";
import { commandBus, eventBus } from "@shared/infrastructure/buses";

export function registerImportBudgetJsonCommandHandler() {
  const importer = new JsonBudgetImporter(
    new JsonParseBudgetRepository(),
    eventBus,
  );
  const commandHandler = new ImportBudgetJsonCommandHandler(importer);

  commandBus.register(commandHandler);
}
