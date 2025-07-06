import { ObjectMother } from "./objectMother.mother";
import { Stats } from "./stats";

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
