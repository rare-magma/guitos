import { Stats } from "@guitos/contexts/budget/domain/stats";
import { ObjectMother } from "@shared/domain/objectMother.mother";

export class StatsMother {
  static budgetStats(): Stats {
    return new Stats({
      available: ObjectMother.randomNumber(),
      withGoal: ObjectMother.randomNumber(),
      saved: ObjectMother.randomNumber(),
      goal: ObjectMother.randomNumber(),
      reserves: ObjectMother.randomNumber(),
    });
  }
}
