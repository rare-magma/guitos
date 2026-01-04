import { BudgetCalculator } from "@guitos/application/react/budgetCalculator";
import { Budget } from "@guitos/contexts/budget/domain/budget";
import { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
import type { CsvItem } from "@guitos/contexts/budget/domain/csvItem";
import { roundBig } from "./utils";

export type CsvRow = CsvItem & {
  type: "expense" | "income" | "goal" | "reserves";
  name: string;
  amount: string | number;
  value?: string | number; // deprecated legacy field
};

export class BudgetCsvService {
  static fromCsv(csv: CsvRow[], date: string): Budget {
    const newBudget = Budget.create(date);

    csv.forEach((item, key) => {
      const newBudgetItem = new BudgetItem({
        id: key,
        name: item.name,
        amount: Number(item.amount),
      });

      switch (item.type) {
        case "expense":
          newBudget.expenses.items.push(newBudgetItem);
          break;
        case "income":
          newBudget.incomes.items.push(newBudgetItem);
          break;
        case "goal":
          newBudget.stats.goal = Number(item.amount);
          break;
        case "reserves":
          newBudget.stats.reserves = Number(item.amount);
          break;
      }
    });

    newBudget.expenses.total = roundBig(
      BudgetCalculator.itemsTotal(newBudget.expenses.items),
      2,
    );
    newBudget.incomes.total = roundBig(
      BudgetCalculator.itemsTotal(newBudget.incomes.items),
      2,
    );
    newBudget.stats.available = roundBig(
      BudgetCalculator.available(newBudget),
      2,
    );
    newBudget.stats.withGoal = BudgetCalculator.availableWithGoal(newBudget);
    newBudget.stats.saved = BudgetCalculator.saved(newBudget);

    return newBudget;
  }

  static toCsv(budget: Readonly<Budget>): string {
    const header = ["type", "name", "amount"];

    const expenses = budget.expenses.items.map((expense: BudgetItem) => {
      return ["expense", expense.name, expense.amount].join(",");
    });

    const incomes = budget.incomes.items.map((income: BudgetItem) => {
      return ["income", income.name, income.amount].join(",");
    });

    const stats = ["goal", "goal", budget.stats.goal].join(",");
    const reserves = ["reserves", "reserves", budget.stats.reserves].join(",");

    return [header, ...expenses, ...incomes, stats, reserves].join("\n");
  }
}
