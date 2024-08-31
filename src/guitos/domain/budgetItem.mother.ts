import { faker } from "@faker-js/faker";
import { BudgetItem } from "./budgetItem";
import { ObjectMother } from "./objectMother.mother";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class BudgetItemsMother {
  static budgetItems(): BudgetItem[] {
    const list = [
      new BudgetItem(
        ObjectMother.positiveNumber(),
        faker.lorem.word(),
        faker.number.int(),
      ),
      new BudgetItem(
        ObjectMother.positiveNumber(),
        faker.lorem.word(),
        faker.number.int(),
      ),
      new BudgetItem(
        ObjectMother.positiveNumber(),
        faker.lorem.word(),
        faker.number.int(),
      ),
    ];

    return faker.helpers.arrayElements(list);
  }
}
