import { ObjectMother } from "../../shared/domain/objectMother.mother";
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
