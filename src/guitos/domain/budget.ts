import Expenses from "./expenses";
import Incomes from "./incomes";
import Stats from "./stats";
import Uuid from "./uuid";
import { immerable } from "immer";

export default class Budget {
  id: Uuid;
  name: string;
  expenses: Expenses;
  incomes: Incomes;
  stats: Stats;

  [immerable] = true;

  constructor(
    id: Uuid,
    name: string,
    expenses: Expenses,
    incomes: Incomes,
    stats: Stats,
  ) {
    this.id = id;
    this.name = name;
    this.expenses = expenses;
    this.incomes = incomes;
    this.stats = stats;
  }

  static create(date?: string, goal?: number): Budget {
    const newId = new Uuid(crypto.randomUUID());
    const year = new Date().getFullYear();
    const newBudget = new Budget(
      newId,
      date ?? `${year}-${newId.toString().slice(0, 8)}`,
      {
        items: [{ id: 1, name: "", value: 0 }],
        total: 0,
      },
      {
        items: [{ id: 1, name: "", value: 0 }],
        total: 0,
      },
      {
        available: 0,
        withGoal: 0,
        saved: 0,
        goal: goal ?? 10,
        reserves: 0,
      },
    );

    return newBudget;
  }
}
