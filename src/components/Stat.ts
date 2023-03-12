export class Stat {
  id!: string;
  available!: number;
  withGoal!: number;
  saved!: number;
  goal!: number;
  savings!: number;
  get isNew(): boolean {
    return this.id === undefined;
  }

  constructor(initializer?: Stat) {
    if (!initializer) return;
    if (initializer.id) this.id = initializer.id;
    if (initializer.available) this.available = initializer.available;
    if (initializer.withGoal) this.withGoal = initializer.withGoal;
    if (initializer.saved) this.saved = initializer.saved;
    if (initializer.goal) this.goal = initializer.goal;
    if (initializer.savings) this.savings = initializer.savings;
  }
}
