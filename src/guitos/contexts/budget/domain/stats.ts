import { AggregateRoot } from "@shared/domain/aggregateRoot";
import type { Primitives } from "@shared/domain/primitives";

export class Stats extends AggregateRoot {
  available: number;
  withGoal: number;
  saved: number;
  goal: number;
  reserves: number;

  constructor(
    available: number,
    withGoal: number,
    saved: number,
    goal: number,
    reserves: number,
  ) {
    super();

    this.available = available;
    this.withGoal = withGoal;
    this.saved = saved;
    this.goal = goal;
    this.reserves = reserves;
  }

  static create(goal?: number): Stats {
    return new Stats(0, 0, 0, goal ?? 10, 0);
  }

  toPrimitives(): Primitives<Stats> {
    return {
      available: this.available,
      withGoal: this.withGoal,
      saved: this.saved,
      goal: this.goal,
      reserves: this.reserves,
    };
  }
}
