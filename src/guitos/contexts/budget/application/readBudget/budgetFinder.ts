import type { FindBudgetQuery } from "@guitos/contexts/budget/application/readBudget/findBudgetQuery";
import { FindBudgetResponse } from "@guitos/contexts/budget/application/readBudget/findBudgetResponse";
import { Budget } from "@guitos/contexts/budget/domain/budget";
import type { BudgetRepository } from "@guitos/contexts/budget/domain/budgetRepository";
import { Expenses } from "@guitos/contexts/budget/domain/expenses";
import { Incomes } from "@guitos/contexts/budget/domain/incomes";
import { Stats } from "@guitos/contexts/budget/domain/stats";
import { Uuid } from "@shared/domain/uuid";

export class BudgetFinder {
  private readonly repository: BudgetRepository;

  constructor(repository: BudgetRepository) {
    this.repository = repository;
  }

  async run(query: FindBudgetQuery): Promise<FindBudgetResponse> {
    const budget = await this.repository.find(new Uuid(query.budgetId));
    if (!budget) {
      return new FindBudgetResponse({ budget: null });
    }
    const newBudget = new Budget(
      new Uuid(budget.id),
      budget.name,
      new Expenses(budget.expenses.items, budget.expenses.total),
      new Incomes(budget.incomes.items, budget.incomes.total),
      new Stats(
        budget.stats.available,
        budget.stats.withGoal,
        budget.stats.saved,
        budget.stats.goal,
        budget.stats.reserves,
      ),
    );

    return new FindBudgetResponse({ budget: newBudget.toPrimitives() });
  }
}
