import type { FindAllBudgetsQuery } from "@guitos/contexts/budget/application/readAllBudgets/findAllBudgetsQuery";
import { FindAllBudgetsResponse } from "@guitos/contexts/budget/application/readAllBudgets/findAllBudgetsResponse";
import { Budget } from "@guitos/contexts/budget/domain/budget";
import { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
import type { BudgetRepository } from "@guitos/contexts/budget/domain/budgetRepository";
import { Expenses } from "@guitos/contexts/budget/domain/expenses";
import { Incomes } from "@guitos/contexts/budget/domain/incomes";
import { Stats } from "@guitos/contexts/budget/domain/stats";
import { Uuid } from "@shared/domain/uuid";

export class BudgetsFinder {
  private readonly repository: BudgetRepository;

  constructor(repository: BudgetRepository) {
    this.repository = repository;
  }

  async run(_query: FindAllBudgetsQuery): Promise<FindAllBudgetsResponse> {
    const budgets = await this.repository.findAll();
    if (!budgets) {
      return new FindAllBudgetsResponse({ budgets: [] });
    }

    const allBudgets = [];

    for (const budget of budgets) {
      const newBudget = new Budget({
        id: new Uuid(budget.id).value,
        name: budget.name,
        expenses: new Expenses(
          budget.expenses.items.map(
            (expense) => new BudgetItem({ ...expense }),
          ),
          budget.expenses.total,
        ),
        incomes: new Incomes(
          budget.incomes.items.map((income) => new BudgetItem({ ...income })),
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

      allBudgets.push(newBudget.toPrimitives());
    }

    return new FindAllBudgetsResponse({
      budgets: allBudgets
        .toSorted((a, b) => a.name?.localeCompare(b.name))
        .toReversed(),
    });
  }
}
