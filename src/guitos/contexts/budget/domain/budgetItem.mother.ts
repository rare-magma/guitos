import { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
import { ObjectMother } from "@shared/domain/objectMother.mother";

export class BudgetItemsMother {
  static budgetItems(): BudgetItem[] {
    const list = [
      new BudgetItem({
        id: ObjectMother.positiveNumber(),
        name: ObjectMother.word(),
        amount: ObjectMother.zeroOrPositiveNumber(),
      }),
      new BudgetItem({
        id: ObjectMother.positiveNumber(),
        name: ObjectMother.word(),
        amount: ObjectMother.zeroOrPositiveNumber(),
      }),
      new BudgetItem({
        id: ObjectMother.positiveNumber(),
        name: ObjectMother.word(),
        amount: ObjectMother.zeroOrPositiveNumber(),
      }),
    ];

    return ObjectMother.randomElementsFromList(list);
  }

  static itemForm1() {
    return new BudgetItem({ id: 1, name: "name1", amount: 10 });
  }

  static itemForm2() {
    return new BudgetItem({ id: 2, name: "name2", amount: 100 });
  }
}
