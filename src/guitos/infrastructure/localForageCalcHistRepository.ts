import { CalcHistRepository } from "../domain/calcHistRepository";
import CalculationHistoryItem from "../domain/calculationHistoryItem";
import { calcHistDB } from "./localForageDb";

export class localForageCalcHistRepository implements CalcHistRepository {
  async get(id: string): Promise<CalculationHistoryItem[] | null> {
    try {
      return await calcHistDB.getItem<CalculationHistoryItem[]>(id);
    } catch {
      return null;
    }
  }

  async getAll(): Promise<CalculationHistoryItem[][] | null> {
    try {
      let list: CalculationHistoryItem[][] = [];
      for (const item of await calcHistDB.keys()) {
        if (item) {
          const calcHist =
            await calcHistDB.getItem<CalculationHistoryItem[]>(item);
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
      await calcHistDB.setItem(
        id,
        newCalcHist.map((item) => CalculationHistoryItem.toSafeFormat(item)),
      );
      return true;
    } catch {
      return false;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await calcHistDB.removeItem(id);
      return true;
    } catch {
      return false;
    }
  }
}
