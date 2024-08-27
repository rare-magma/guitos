import { faker } from "@faker-js/faker";
import BudgetItem from "./budgetItem";
import Stats from "./stats";
import Uuid from "./uuid";

export default class ObjectMother {
  static uuid(): Uuid {
    return new Uuid(faker.string.uuid());
  }

  static randomNumber(): number {
    return faker.number.int({ min: Number.MIN_SAFE_INTEGER });
  }

  static indexNumber(max: number): number {
    return faker.number.int({ min: 0, max });
  }

  static word(): string {
    return faker.lorem.word();
  }

  static words(): string {
    return faker.lorem.words();
  }

  static coin(): boolean {
    return faker.datatype.boolean();
  }

  static positiveNumber(max?: number): number {
    return faker.number.int({ min: 1, max });
  }

  static zeroOrPositiveNumber(max?: number): number {
    return faker.number.int({ min: 0, max });
  }

  static text(): string {
    return faker.lorem.paragraph();
  }

  static recentDate(): Date {
    return faker.date.recent();
  }

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

  static budgetStats(): Stats {
    return new Stats(
      ObjectMother.randomNumber(),
      ObjectMother.randomNumber(),
      ObjectMother.randomNumber(),
      ObjectMother.randomNumber(),
      ObjectMother.randomNumber(),
    );
  }
}
