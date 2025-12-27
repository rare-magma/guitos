import { Stats } from "@guitos/domain/stats";
import { ObjectMother } from "@shared/domain/objectMother.mother";

export class StatsMother {
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
