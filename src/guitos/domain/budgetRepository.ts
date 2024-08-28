import type { Budget } from "./budget";
import type { Uuid } from "./uuid";

export interface BudgetRepository {
  get(id: Uuid): Promise<Budget>;
  getAll(): Promise<Budget[]>;
  update(id: Uuid, newBudget: Budget): Promise<boolean>;
  delete(id: Uuid): Promise<boolean>;
}
