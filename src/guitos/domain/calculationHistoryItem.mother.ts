import { BudgetMother } from "./budget.mother";
import { BudgetItemsMother } from "./budgetItem.mother";

export class CalculationHistoryItemMother {
  static testCalcHist() {
    return [
      {
        id: `${BudgetMother.testBudget().id}-Expenses-1`,
        itemForm: BudgetItemsMother.itemForm1(),
        changeValue: 123,
        operation: "add",
      },
      {
        id: `${BudgetMother.testBudget().id}-Expenses-1`,
        itemForm: {
          id: 1,
          name: BudgetItemsMother.itemForm1().name,
          value: 133,
        },
        changeValue: 3,
        operation: "add",
      },
    ];
  }
}
