export class Stat {
  available!: number;
  withGoal!: number;
  saved!: number;
  goal!: number;
  reserves!: number;

  constructor(initializer?: Stat) {
    if (!initializer) return;
    if (initializer.available) this.available = initializer.available;
    if (initializer.withGoal) this.withGoal = initializer.withGoal;
    if (initializer.saved) this.saved = initializer.saved;
    if (initializer.goal) this.goal = initializer.goal;
    if (initializer.reserves) this.reserves = initializer.reserves;
  }
}
