import { immerable } from "immer";
import type { BudgetItem } from "./budgetItem";
import { Uuid } from "./uuid";

export type ItemOperation =
  | "name"
  | "value"
  | "add"
  | "subtract"
  | "multiply"
  | "divide";

export class CalculationHistoryItem {
  id: string;
  itemForm: BudgetItem;
  changeValue: number;
  operation: ItemOperation;

  [immerable] = true;

  constructor(
    id: string,
    itemForm: BudgetItem,
    changeValue: number,
    operation: ItemOperation,
  ) {
    this.id = id;
    this.itemForm = itemForm;
    this.changeValue = changeValue;
    this.operation = operation;
  }

  static create(
    itemForm: BudgetItem,
    changeValue: number,
    operation: ItemOperation,
  ): CalculationHistoryItem {
    const newId = `${Uuid.random()}-${itemForm.id}`;
    const newCalcHist = new CalculationHistoryItem(
      newId,
      itemForm,
      changeValue,
      operation,
    );

    return newCalcHist;
  }
}
