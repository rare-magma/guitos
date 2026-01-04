import { BudgetChangedDomainEvent } from "@guitos/contexts/budget/domain/budgetChangedDomainEvent";
import { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
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

  constructor({ id, name, expenses, incomes, stats }: Primitives<Budget>) {
    super();

    this.id = new Uuid(id);
    this.name = name;
    this.expenses = new Expenses(
      expenses.items.map((expense) => new BudgetItem({ ...expense })),
      expenses.total,
    );
    this.incomes = new Incomes(
      incomes.items.map((income) => new BudgetItem({ ...income })),
      incomes.total,
    );
    this.stats = new Stats(stats);
  }

  static create(date?: string, goal?: number): Budget {
    const newId = Uuid.random();
    const year = new Date().getFullYear();
    const newBudget = new Budget({
      id: newId.value,
      name: date ?? `${year}-${newId.toString().slice(0, 8)}`,
      expenses: Expenses.create().toPrimitives(),
      incomes: Incomes.create().toPrimitives(),
      stats: Stats.create(goal),
    });
    newBudget.record(new BudgetChangedDomainEvent(newBudget.toPrimitives()));

    return newBudget;
  }

  static clone(budget: Budget): Budget {
    const clonedBudget = new Budget({
      ...budget,
      id: Uuid.random().value,
      name: `${budget.name}-clone`,
    });

    clonedBudget.record(
      new BudgetChangedDomainEvent(clonedBudget.toPrimitives()),
    );
    return clonedBudget;
  }

  static update(budget: Budget): Budget {
    const updatedBudget = new Budget({ ...budget.toPrimitives() });

    updatedBudget.record(
      new BudgetChangedDomainEvent(updatedBudget.toPrimitives()),
    );
    return updatedBudget;
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
