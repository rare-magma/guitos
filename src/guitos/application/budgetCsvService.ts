import { BudgetCalculator } from "@guitos/application/budgetCalculator";
import { Budget } from "@guitos/domain/budget";
import { BudgetItem } from "@guitos/domain/budgetItem";
import type { CsvItem } from "@guitos/domain/csvItem";
import { roundBig } from "../../utils";

export type CsvRow = CsvItem & {
  type: "expense" | "income" | "goal" | "reserves";
  name: string;
  value: string | number;
};

export class BudgetCsvService {
  static fromCsv(csv: CsvRow[], date: string): Budget {
    const newBudget = Budget.createEmpty(date);

    csv.forEach((item, key) => {
      const newBudgetItem = new BudgetItem(key, item.name, Number(item.value));

      switch (item.type) {
        case "expense":
          newBudget.expenses.items.push(newBudgetItem);
          break;
        case "income":
          newBudget.incomes.items.push(newBudgetItem);
          break;
        case "goal":
          newBudget.stats.goal = Number(item.value);
          break;
        case "reserves":
          newBudget.stats.reserves = Number(item.value);
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
}
