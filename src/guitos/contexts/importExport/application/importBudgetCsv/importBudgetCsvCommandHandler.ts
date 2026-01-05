import type { CsvBudgetImporter } from "@guitos/contexts/importExport/application/importBudgetCsv/csvBudgetImporter";
import { ImportBudgetCsvCommand } from "@guitos/contexts/importExport/application/importBudgetCsv/importBudgetCsvCommand";
import type { Command } from "@shared/domain/commandBus/command";
import type { CommandHandler } from "@shared/domain/commandBus/commandHandler";

export class ImportBudgetCsvCommandHandler
  implements CommandHandler<ImportBudgetCsvCommand>
{
  private importer: CsvBudgetImporter;

  constructor(importer: CsvBudgetImporter) {
    this.importer = importer;
  }

  subscribedTo(): Command {
    return ImportBudgetCsvCommand;
  }

  async handle(command: ImportBudgetCsvCommand): Promise<void> {
    return await this.importer.run(command);
  }
}
