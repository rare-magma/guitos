import { AggregateRoot } from "@shared/domain/aggregateRoot";
import type { Primitives } from "@shared/domain/primitives";

export class Stats extends AggregateRoot {
  available: number;
  withGoal: number;
  saved: number;
  goal: number;
  reserves: number;

  constructor({
    available,
    withGoal,
    saved,
    goal,
    reserves,
  }: Primitives<Stats>) {
    super();

    this.available = available;
    this.withGoal = withGoal;
    this.saved = saved;
    this.goal = goal;
    this.reserves = reserves;
  }

  static create(goal?: number): Stats {
    return new Stats({
      available: 0,
      withGoal: 0,
      saved: 0,
      goal: goal ?? 10,
      reserves: 0,
    });
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
