import type { PersistLastOpenedBudgetCommand } from "@guitos/contexts/budget/application/saveLastOpenedBudget/persistLastOpenedBudgetCommand";
import type { LastOpenedBudgetRepository } from "@guitos/contexts/budget/domain/lastOpenedBudgetRepository";

export class LastOpenedBudgetPersister {
  private readonly repository: LastOpenedBudgetRepository;

  constructor(repository: LastOpenedBudgetRepository) {
    this.repository = repository;
  }

  run({ budgetName }: PersistLastOpenedBudgetCommand): void {
    this.repository.save(budgetName);
    // await this.eventBus.publish(userPreferences.pullDomainEvents());
  }
}
