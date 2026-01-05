import { ImportBudgetJsonCommand } from "@guitos/contexts/importExport/application/importBudgetJson/importBudgetJsonCommand";
import type { JsonBudgetImporter } from "@guitos/contexts/importExport/application/importBudgetJson/jsonBudgetImporter";
import type { Command } from "@shared/domain/commandBus/command";
import type { CommandHandler } from "@shared/domain/commandBus/commandHandler";

export class ImportBudgetJsonCommandHandler
  implements CommandHandler<ImportBudgetJsonCommand>
{
  private importer: JsonBudgetImporter;

  constructor(importer: JsonBudgetImporter) {
    this.importer = importer;
  }

  subscribedTo(): Command {
    return ImportBudgetJsonCommand;
  }

  async handle(command: ImportBudgetJsonCommand): Promise<void> {
    return await this.importer.run(command);
  }
}
