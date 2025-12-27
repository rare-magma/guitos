import type { ItemOperation } from "@guitos/contexts/operations/domain/itemOperation";
import type { Nullable } from "@shared/domain/nullable";
import type { Primitives } from "@shared/domain/primitives";

export interface OperationsRepository {
  find(id: string): Promise<Nullable<Primitives<ItemOperation[]>>>;
  findAll(): Promise<Nullable<Primitives<ItemOperation[][]>>>;
  update(
    id: string,
    itemOperations: Primitives<ItemOperation[]>,
  ): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}
