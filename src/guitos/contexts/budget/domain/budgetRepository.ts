import type { Budget } from "@guitos/contexts/budget/domain/budget";
import type { Nullable } from "@shared/domain/nullable";
import type { Primitives } from "@shared/domain/primitives";
import type { Uuid } from "@shared/domain/uuid";

export interface BudgetRepository {
  find(id: Primitives<Uuid>): Promise<Nullable<Primitives<Budget>>>;
  findAll(): Promise<Nullable<Primitives<Budget[]>>>;
  save(id: Primitives<Uuid>, newBudget: Primitives<Budget>): Promise<boolean>;
  delete(id: Primitives<Uuid>): Promise<boolean>;
}
