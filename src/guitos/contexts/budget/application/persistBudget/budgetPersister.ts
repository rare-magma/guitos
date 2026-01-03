import type { PersistBudgetCommand } from "@guitos/contexts/budget/application/persistBudget/persistBudgetCommand";
import type { BudgetRepository } from "@guitos/contexts/budget/domain/budgetRepository";
import { Uuid } from "@shared/domain/uuid";

export class BudgetPersister {
  private readonly repository: BudgetRepository;

  constructor(repository: BudgetRepository) {
    this.repository = repository;
  }

  run({ budget }: PersistBudgetCommand): void {
    this.repository.save(new Uuid(budget.id), budget);
    // TODO: is this necessary?
    // await this.eventBus.publish(userPreferences.pullDomainEvents());
  }
}
