import type { Budget } from "@guitos/contexts/budget/domain/budget";
import type { BudgetRepository } from "@guitos/contexts/budget/domain/budgetRepository";
import type { Primitives } from "@shared/domain/primitives";
import type { Uuid } from "@shared/domain/uuid";
import localforage from "localforage";

export class LocalForageBudgetRepository implements BudgetRepository {
  private readonly budgetsDB;

  constructor() {
    this.budgetsDB = localforage.createInstance({
      name: "guitos",
      storeName: "budgets",
    });
  }

  async find(id: Primitives<Uuid>): Promise<Primitives<Budget>> {
    try {
      const budget = await this.budgetsDB.getItem<Primitives<Budget>>(id.value);
      if (!budget) throw new Error();
      return budget;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  async findAll(): Promise<Primitives<Budget[]>> {
    try {
      const list: Primitives<Budget[]> = [];
      for (const item of await this.budgetsDB.keys()) {
        if (item) {
          const budget = await this.budgetsDB.getItem<Primitives<Budget>>(item);
          if (budget) {
            list.push(budget);
          }
        }
      }
      return list;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  async save(
    id: Primitives<Uuid>,
    newBudget: Primitives<Budget>,
  ): Promise<boolean> {
    try {
      await this.budgetsDB.setItem(id.value, newBudget);
      return true;
    } catch {
      return false;
    }
  }

  async delete(id: Primitives<Uuid>): Promise<boolean> {
    try {
      await this.budgetsDB.removeItem(id.value);
      return true;
    } catch {
      return false;
    }
  }
}
