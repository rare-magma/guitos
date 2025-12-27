import type { ItemOperation } from "@guitos/contexts/operations/domain/itemOperation";
import type { OperationsRepository } from "@guitos/contexts/operations/domain/operationsRepository";
import type { Primitives } from "@shared/domain/primitives";
import localforage from "localforage";

export class LocalForageOperationsRepository implements OperationsRepository {
  private readonly operationsDb;

  constructor() {
    this.operationsDb = localforage.createInstance({
      name: "guitos",
      storeName: "itemOperations",
    });
  }

  async find(id: string): Promise<Primitives<ItemOperation[]> | null> {
    try {
      return await this.operationsDb.getItem<Primitives<ItemOperation[]>>(id);
    } catch {
      return null;
    }
  }

  async findAll(): Promise<Primitives<ItemOperation[][]> | null> {
    try {
      const list: Primitives<ItemOperation[][]> = [];
      for (const item of await this.operationsDb.keys()) {
        if (item) {
          const itemOperations =
            await this.operationsDb.getItem<Primitives<ItemOperation[]>>(item);
          if (itemOperations) {
            list.push(itemOperations);
          }
        }
      }
      return list;
    } catch {
      return null;
    }
  }

  async update(
    id: string,
    itemOperations: Primitives<ItemOperation[]>,
  ): Promise<boolean> {
    try {
      await this.operationsDb.setItem(id, itemOperations);
      return true;
    } catch {
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.operationsDb.removeItem(id);
      return true;
    } catch {
      return false;
    }
  }
}
