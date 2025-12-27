import type { Budget } from "@guitos/contexts/budget/domain/budget";
import type { Uuid } from "@shared/domain/uuid";

export interface BudgetRepository {
  get(id: Uuid): Promise<Budget>;
  getAll(): Promise<Budget[]>;
  update(id: Uuid, newBudget: Budget): Promise<boolean>;
  delete(id: Uuid): Promise<boolean>;
}
