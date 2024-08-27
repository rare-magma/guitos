import { budgetsDB } from "./localForageDb";
import Budget from "../domain/budget";
import { BudgetRepository } from "../domain/budgetRepository";
import Uuid from "../domain/uuid";

export class localForageBudgetRepository implements BudgetRepository {
  async get(id: Uuid): Promise<Budget> {
    try {
      const budget = await budgetsDB.getItem<Budget>(id.toString());
      if (!budget) throw new Error();
      return budget;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async getAll(): Promise<Budget[]> {
    try {
      let list: Budget[] = [];
      for (const item of await budgetsDB.keys()) {
        if (item) {
          const budget = await budgetsDB.getItem<Budget>(item);
          if (budget) {
            list.push(budget);
          }
        }
      }
      return list;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async update(id: Uuid, newBudget: Budget): Promise<boolean> {
    console.log(
      "file: localForageBudgetRepository.ts:35 ~ update ~ newBudget:",
      newBudget,
    );
    console.log("file: localForageBudgetRepository.ts:35 ~ update ~ id:", id);
    try {
      await budgetsDB.setItem(id.value, newBudget);
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
