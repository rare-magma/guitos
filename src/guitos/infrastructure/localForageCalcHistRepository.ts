import localforage from "localforage";
import type { CalcHistRepository } from "../domain/calcHistRepository";
import type { CalculationHistoryItem } from "../domain/calculationHistoryItem";

export class localForageCalcHistRepository implements CalcHistRepository {
  private readonly calcHistDB;

  constructor() {
    this.calcHistDB = localforage.createInstance({
      name: "guitos",
      storeName: "calcHistDB",
    });
  }
  async get(id: string): Promise<CalculationHistoryItem[] | null> {
    try {
      return await this.calcHistDB.getItem<CalculationHistoryItem[]>(id);
    } catch {
      return null;
    }
  }

  async getAll(): Promise<CalculationHistoryItem[][] | null> {
    try {
      const list: CalculationHistoryItem[][] = [];
      for (const item of await this.calcHistDB.keys()) {
        if (item) {
          const calcHist =
            await this.calcHistDB.getItem<CalculationHistoryItem[]>(item);
          if (calcHist) {
            list.push(calcHist);
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
    newCalcHist: CalculationHistoryItem[],
  ): Promise<boolean> {
    try {
      await this.calcHistDB.setItem(
        id,
        newCalcHist.map((item) => item),
      );
      return true;
    } catch {
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.calcHistDB.removeItem(id);
      return true;
    } catch {
      return false;
    }
  }
}
