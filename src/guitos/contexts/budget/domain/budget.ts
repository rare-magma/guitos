import { BudgetChangedDomainEvent } from "@guitos/contexts/budget/domain/budgetChangedDomainEvent";
import { Expenses } from "@guitos/contexts/budget/domain/expenses";
import { Incomes } from "@guitos/contexts/budget/domain/incomes";
import { Stats } from "@guitos/contexts/budget/domain/stats";
import { AggregateRoot } from "@shared/domain/aggregateRoot";
import type { Primitives } from "@shared/domain/primitives";
import { Uuid } from "@shared/domain/uuid";

export class Budget extends AggregateRoot {
  id: Uuid;
  name: string;
  expenses: Expenses;
  incomes: Incomes;
  stats: Stats;

  constructor(
    id: Uuid,
    name: string,
    expenses: Expenses,
    incomes: Incomes,
    stats: Stats,
  ) {
    super();

    this.id = id;
    this.name = name;
    this.expenses = expenses;
    this.incomes = incomes;
    this.stats = stats;
  }

  static create(date?: string, goal?: number): Budget {
    const newId = Uuid.random();
    const year = new Date().getFullYear();
    const newBudget = new Budget(
      newId,
      date ?? `${year}-${newId.toString().slice(0, 8)}`,
      Expenses.create(),
      Incomes.create(),
      Stats.create(goal),
    );
    newBudget.record(new BudgetChangedDomainEvent(newBudget.toPrimitives()));

    return newBudget;
  }

  static clone(budget: Budget): Budget {
    const clonedBudget = new Budget(
      Uuid.random(),
      `${budget.name}-clone`,
      budget.expenses,
      budget.incomes,
      budget.stats,
    );

    clonedBudget.record(
      new BudgetChangedDomainEvent(clonedBudget.toPrimitives()),
    );
    return clonedBudget;
  }

  toPrimitives(): Primitives<Budget> {
    return {
      id: this.id.toString(),
      name: this.name,
      expenses: this.expenses.toPrimitives(),
      incomes: this.incomes.toPrimitives(),
      stats: this.stats.toPrimitives(),
    };
  }
}
