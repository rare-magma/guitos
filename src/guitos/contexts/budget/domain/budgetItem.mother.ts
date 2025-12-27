import { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
import { ObjectMother } from "@shared/domain/objectMother.mother";

export class BudgetItemsMother {
  static budgetItems(): BudgetItem[] {
    const list = [
      new BudgetItem(
        ObjectMother.positiveNumber(),
        ObjectMother.word(),
        ObjectMother.zeroOrPositiveNumber(),
      ),
      new BudgetItem(
        ObjectMother.positiveNumber(),
        ObjectMother.word(),
        ObjectMother.zeroOrPositiveNumber(),
      ),
      new BudgetItem(
        ObjectMother.positiveNumber(),
        ObjectMother.word(),
        ObjectMother.zeroOrPositiveNumber(),
      ),
    ];

    return ObjectMother.randomElementsFromList(list);
  }

  static itemForm1() {
    return new BudgetItem(1, "name1", 10);
  }

  static itemForm2() {
    return new BudgetItem(2, "name2", 100);
  }
}
