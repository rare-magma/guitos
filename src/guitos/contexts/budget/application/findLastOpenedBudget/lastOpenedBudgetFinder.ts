import type { LastOpenedBudgetQuery } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetQuery";
import { LastOpenedBudgetResponse } from "@guitos/contexts/budget/application/findLastOpenedBudget/lastOpenedBudgetResponse";
import type { LastOpenedBudgetRepository } from "@guitos/contexts/budget/domain/lastOpenedBudgetRepository";

export class LastOpenedBudgetFinder {
  private readonly repository: LastOpenedBudgetRepository;

  constructor(repository: LastOpenedBudgetRepository) {
    this.repository = repository;
  }

  run(_query: LastOpenedBudgetQuery): LastOpenedBudgetResponse {
    const lastOpenedBudgetName = this.repository.find();

    return new LastOpenedBudgetResponse({ name: lastOpenedBudgetName });
  }
}
