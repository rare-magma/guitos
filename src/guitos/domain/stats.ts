export default class Stats {
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
    this.available = available;
    this.withGoal = withGoal;
    this.saved = saved;
    this.goal = goal;
    this.reserves = reserves;
  }
}
