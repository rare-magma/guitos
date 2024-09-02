import { Budget } from "../domain/budget";
import type { BudgetRepository } from "../domain/budgetRepository";
import type { Uuid } from "../domain/uuid";
import { budgetsDB } from "./localForageDb";

export class localForageBudgetRepository implements BudgetRepository {
  async get(id: Uuid): Promise<Budget> {
    try {
      const budget = await budgetsDB.getItem<Budget>(id.toString());
      if (!budget) throw new Error();
      return budget;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  async getAll(): Promise<Budget[]> {
    try {
      const list: Budget[] = [];
      for (const item of await budgetsDB.keys()) {
        if (item) {
          const budget = await budgetsDB.getItem<Budget>(item);
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

  async update(id: Uuid, newBudget: Budget): Promise<boolean> {
    try {
      await budgetsDB.setItem(id.toString(), Budget.toSafeFormat(newBudget));
      return true;
    } catch {
      return false;
    }
  }

  async delete(id: Uuid): Promise<boolean> {
    try {
      await budgetsDB.removeItem(id.toString());
      return true;
    } catch {
      return false;
    }
  }
}