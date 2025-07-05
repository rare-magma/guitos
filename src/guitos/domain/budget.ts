import { immerable } from "immer";
import type { BudgetItem } from "./budgetItem";
import type { Expenses } from "./expenses";
import type { Incomes } from "./incomes";
import type { Stats } from "./stats";
import { Uuid } from "./uuid";

export class Budget {
  id: Uuid;
  name: string;
  expenses: Expenses;
  incomes: Incomes;
  stats: Stats;

  [immerable] = true;

  constructor(
    id: Uuid,
    name: string,
    expenses: Expenses,
    incomes: Incomes,
    stats: Stats,
  ) {
    this.id = id;
    this.name = name;
    this.expenses = expenses;
    this.incomes = incomes;
    this.stats = stats;
  }

  static create(date?: string, goal?: number): Budget {
    const newId = Uuid.random();
    const year = new Date().getFullYear();
    const newBudget = new Budget(
      newId,
      date ?? `${year}-${newId.toString().slice(0, 8)}`,
      {
        items: [{ id: 1, name: "", value: 0 }],
        total: 0,
      },
      {
        items: [{ id: 1, name: "", value: 0 }],
        total: 0,
      },
      {
        available: 0,
        withGoal: 0,
        saved: 0,
        goal: goal ?? 10,
        reserves: 0,
      },
    );

    return newBudget;
  }

  static createEmpty(name: string): Budget {
    const emptyExpenses: BudgetItem[] = [];
    const emptyIncomes: BudgetItem[] = [];
    const emptyBudget: Budget = {
      ...Budget.create(name, 0),
      expenses: {
        items: emptyExpenses,
        total: 0,
      },
      incomes: {
        items: emptyIncomes,
        total: 0,
      },
    };
    return emptyBudget;
  }

  static clone(budget: Budget): Budget {
    const clonedBudget: Budget = {
      ...budget,
      id: Uuid.random(),
      name: `${budget.name}-clone`,
    };
    return clonedBudget;
  }

  static toSafeFormat(budget: Budget) {
    return {
      ...budget,
      id: budget.id.toString(),
    };
  }
}
