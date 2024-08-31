import { ObjectMother } from "./objectMother.mother";
import { Stats } from "./stats";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
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
