import type { Nullable } from "@shared/domain/nullable";

export interface LastOpenedBudgetRepository {
  find(): Nullable<string>;
  save(name: string): boolean;
}
