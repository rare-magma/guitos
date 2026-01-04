import type { FindBudgetQuery } from "@guitos/contexts/budget/application/readBudget/findBudgetQuery";
import { FindBudgetResponse } from "@guitos/contexts/budget/application/readBudget/findBudgetResponse";
import { Budget } from "@guitos/contexts/budget/domain/budget";
import { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
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
    const newBudget = new Budget({
      id: new Uuid(budget.id).value,
      name: budget.name,
      expenses: new Expenses(
        budget.expenses.items.map(
          (expense) => new BudgetItem(expense.id, expense.name, expense.amount),
        ),
        budget.expenses.total,
      ),
      incomes: new Incomes(
        budget.incomes.items.map(
          (income) => new BudgetItem(income.id, income.name, income.amount),
        ),
        budget.incomes.total,
      ),
      stats: new Stats({
        available: budget.stats.available,
        withGoal: budget.stats.withGoal,
        saved: budget.stats.saved,
        goal: budget.stats.goal,
        reserves: budget.stats.reserves,
      }),
    });

    return new FindBudgetResponse({ budget: newBudget.toPrimitives() });
  }
}
