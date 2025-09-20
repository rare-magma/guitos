import type { Uuid } from "../../shared/domain/uuid";
import type { Budget } from "./budget";

export interface BudgetRepository {
  get(id: Uuid): Promise<Budget>;
  getAll(): Promise<Budget[]>;
  update(id: Uuid, newBudget: Budget): Promise<boolean>;
  delete(id: Uuid): Promise<boolean>;
}
