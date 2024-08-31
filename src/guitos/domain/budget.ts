import Big from "big.js";
import { immerable } from "immer";
import { roundBig } from "../../utils";
import { BudgetItem } from "./budgetItem";
import type { CsvItem } from "./csvItem";
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

  static fromCsv(csv: string[], date: string): Budget {
    const newBudget = Budget.createEmpty(date);

    csv.forEach((value: string, key: number) => {
      const item = value as unknown as CsvItem;
      const newBudgetItem = new BudgetItem(key, item.name, Number(item.value));

      switch (item.type) {
        case "expense":
          newBudget.expenses.items.push(newBudgetItem);
          newBudget.expenses.total = roundBig(
            Budget.itemsTotal(newBudget.expenses.items),
            2,
          );
          break;
        case "income":
          newBudget.incomes.items.push(newBudgetItem);
          newBudget.incomes.total = roundBig(
            Budget.itemsTotal(newBudget.incomes.items),
            2,
          );
          break;
        case "goal":
          newBudget.stats.goal = Number(item.value);
          break;
        case "reserves":
          newBudget.stats.reserves = Number(item.value);
          break;
      }
    });

    newBudget.stats.available = roundBig(Budget.available(newBudget), 2);
    newBudget.stats.withGoal = Budget.availableWithGoal(newBudget);
    newBudget.stats.saved = Budget.saved(newBudget);

    return newBudget as unknown as Budget;
  }

  static toCsv(budget: Budget): string {
    const header = ["type", "name", "value"];

    const expenses = budget.expenses.items.map((expense) => {
      return ["expense", expense.name, expense.value].join(",");
    });

    const incomes = budget.incomes.items.map((income) => {
      return ["income", income.name, income.value].join(",");
    });

    const stats = ["goal", "goal", budget.stats.goal].join(",");
    const reserves = ["reserves", "reserves", budget.stats.reserves].join(",");

    return [header, ...expenses, ...incomes, stats, reserves].join("\n");
  }

  static itemsTotal(items: BudgetItem[]): Big {
    let total = Big(0);
    if (!items) {
      return total;
    }

    for (const item of items) {
      if (!Number.isNaN(item.value)) {
        total = total.add(Big(item.value));
      }
    }

    return total;
  }

  static available(budget: Budget | undefined): Big {
    if (!budget) {
      return Big(0);
    }
    const expenseTotal = Budget.itemsTotal(budget.expenses.items);
    const incomeTotal = Budget.itemsTotal(budget.incomes.items);
    return incomeTotal.sub(expenseTotal);
  }

  static saved(budget: Budget): number {
    const valueIsCalculable =
      budget.stats.saved !== null && !Number.isNaN(budget.stats.goal);

    if (valueIsCalculable) {
      const available = Budget.itemsTotal(budget.incomes.items);
      const saved = Big(budget.stats.goal).mul(available).div(100);
      return roundBig(saved, 2);
    }
    return 0;
  }

  static availableWithGoal(value: Budget): number {
    const goalIsCalculable =
      value.stats.goal !== null && !Number.isNaN(value.stats.goal);

    if (goalIsCalculable) {
      const available = Budget.available(value);
      const availableWithGoal = Big(value.stats.goal)
        .mul(Budget.itemsTotal(value.incomes.items))
        .div(100);
      return roundBig(available.sub(availableWithGoal), 2);
    }
    return 0;
  }

  static automaticGoal(value: Budget): number {
    const valueIsCalculable =
      value.stats.goal !== null && !Number.isNaN(value.stats.goal);

    if (valueIsCalculable) {
      const incomeTotal = Budget.itemsTotal(value.incomes.items);
      const available = Budget.available(value);

      if (incomeTotal.gt(0) && available.gt(0)) {
        const autoGoal = available.mul(100).div(incomeTotal);
        return roundBig(autoGoal, 5);
      }
    }
    return 0;
  }

  static revenuePercentage(budget: Budget | undefined): number {
    if (!budget) {
      return 0;
    }
    const areRoundNumbers =
      !Number.isNaN(budget.incomes.total) &&
      budget.incomes.total > 0 &&
      !Number.isNaN(budget.expenses.total);
    if (areRoundNumbers) {
      const percentageOfTotal = Big(budget.expenses.total)
        .mul(100)
        .div(budget.incomes.total);

      return roundBig(percentageOfTotal, percentageOfTotal.gte(1) ? 0 : 1);
    }
    return 0;
  }

  static toSafeFormat(budget: Budget) {
    return {
      ...budget,
      id: budget.id.toString(),
    };
  }
}
