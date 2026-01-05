import { Budget } from "@guitos/contexts/budget/domain/budget";
import type { ImportBudgetJsonCommand } from "@guitos/contexts/importExport/application/importBudgetJson/importBudgetJsonCommand";
import { JsonBudgetImportFailedDomainEvent } from "@guitos/contexts/importExport/domain/jsonBudgetImportFailedDomainEvent";
import type { JsonBudgetRepository } from "@guitos/contexts/importExport/domain/jsonBudgetRepository";
import type { EventBus } from "@shared/domain/eventBus/eventBus";

export class JsonBudgetImporter {
  private readonly repository: JsonBudgetRepository;
  private readonly eventBus: EventBus;

  constructor(repository: JsonBudgetRepository, eventBus: EventBus) {
    this.repository = repository;
    this.eventBus = eventBus;
  }

  async run({ budgetName, json }: ImportBudgetJsonCommand): Promise<void> {
    const jsonImport = this.repository.import(json);
    for (const budget of jsonImport.data) {
      const newBudget = Budget.update(new Budget(budget)); // TODO: this doesn't make much sense
      await this.eventBus.publish(newBudget.pullDomainEvents());
    }
    if (!jsonImport.success) {
      await this.eventBus.publish([
        new JsonBudgetImportFailedDomainEvent({ ...jsonImport }),
      ]);
    }
  }
}
