import Big from "big.js";
import { roundBig } from "../../utils";

export class BudgetItem {
  id: number;
  name: string;
  value: number;

  constructor(id: number, name: string, value: number) {
    this.id = id;
    this.name = name;
    this.value = value;
  }

  static create(): BudgetItem {
    return new BudgetItem(1, "", 0);
  }

  static percentage(itemValue: number, revenueTotal: number): number {
    if (!itemValue) return 0;
    const canRoundNumbers =
      !Number.isNaN(revenueTotal) &&
      revenueTotal > 0 &&
      !Number.isNaN(itemValue);
    if (canRoundNumbers) {
      const percentageOfTotal = Big(itemValue).mul(100).div(revenueTotal);

      return roundBig(percentageOfTotal, percentageOfTotal.gte(1) ? 0 : 1);
    }
    return 0;
  }
}
