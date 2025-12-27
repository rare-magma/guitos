import type { Budget } from "@guitos/contexts/budget/domain/budget";
import type { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
import Big from "big.js";
import { roundBig } from "./utils";

export class BudgetCalculator {
  static itemsTotal(items: Readonly<BudgetItem[]>): Big {
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

  static available(budget: Readonly<Budget | undefined>): Big {
    if (!budget) {
      return Big(0);
    }
    const expenseTotal = BudgetCalculator.itemsTotal(budget.expenses.items);
    const incomeTotal = BudgetCalculator.itemsTotal(budget.incomes.items);
    return incomeTotal.sub(expenseTotal);
  }

  static availableWithGoal(value: Readonly<Budget>): number {
    const goalIsCalculable =
      value.stats.goal !== null && !Number.isNaN(value.stats.goal);

    if (!goalIsCalculable) {
      return 0;
    }
    const available = BudgetCalculator.available(value);
    const availableWithGoal = Big(value.stats.goal)
      .mul(BudgetCalculator.itemsTotal(value.incomes.items))
      .div(100);
    return roundBig(available.sub(availableWithGoal), 2);
  }

  static saved(budget: Readonly<Budget>): number {
    const valueIsCalculable =
      budget.stats.saved !== null && !Number.isNaN(budget.stats.goal);

    if (!valueIsCalculable) {
      return 0;
    }
    const available = BudgetCalculator.itemsTotal(budget.incomes.items);
    const saved = Big(budget.stats.goal).mul(available).div(100);
    return roundBig(saved, 2);
  }

  static revenuePercentage(budget: Readonly<Budget | undefined>): number {
    if (!budget) {
      return 0;
    }
    const areRoundNumbers =
      !Number.isNaN(budget.incomes.total) &&
      budget.incomes.total > 0 &&
      !Number.isNaN(budget.expenses.total);
    if (!areRoundNumbers) {
      return 0;
    }
    const percentageOfTotal = Big(budget.expenses.total)
      .mul(100)
      .div(budget.incomes.total);

    return roundBig(percentageOfTotal, percentageOfTotal.gte(1) ? 0 : 1);
  }

  static automaticGoal(value: Readonly<Budget>): number {
    const valueIsCalculable =
      value.stats.goal !== null && !Number.isNaN(value.stats.goal);

    if (!valueIsCalculable) {
      return 0;
    }

    const incomeTotal = BudgetCalculator.itemsTotal(value.incomes.items);
    const available = BudgetCalculator.available(value);

    if (incomeTotal.gt(0) && available.gt(0)) {
      const autoGoal = available.mul(100).div(incomeTotal);
      return roundBig(autoGoal, 5);
    }
    return 0;
  }
}
