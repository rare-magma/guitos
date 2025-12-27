import { BudgetItemsMother } from "@guitos/contexts/budget/domain/budgetItem.mother";
import { ItemOperation } from "@guitos/contexts/operations/domain/itemOperation";
import { MathOperation } from "@guitos/contexts/operations/domain/mathOperation";
import { DatetimeMother } from "@shared/domain/datetime.mother";
import { ObjectMother } from "@shared/domain/objectMother.mother";
import type { Primitives } from "@shared/domain/primitives";

export class ItemOperationMother {
  static create(primitives: Primitives<ItemOperation>): ItemOperation {
    return ItemOperation.create(
      primitives.id,
      primitives.budgetItemId,
      primitives.changeValue,
      primitives.mathOperation,
      primitives.createdAt ?? "",
    );
  }

  static random() {
    const mathOperation = ObjectMother.randomElementFromList([
      "add",
      "subtract",
      "multiply",
      "divide",
    ]);
    return new ItemOperation(
      ObjectMother.word(),
      BudgetItemsMother.itemForm1().id.toString(),
      ObjectMother.randomNumber(),
      new MathOperation(mathOperation),
      DatetimeMother.random(),
    );
  }
  static randomList() {
    const list = [];
    for (let i = 0; i < ObjectMother.randomNumber(); i++) {
      list.push(ItemOperationMother.random());
    }
    return list;
  }
}
