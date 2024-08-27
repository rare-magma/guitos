import Big from "big.js";

export type CsvType = "expense" | "income" | "goal" | "reserves";

export default class CsvItem {
  type: CsvType;
  name: string;
  value: Big;

  constructor(type: CsvType, name: string, value: Big) {
    this.type = type;
    this.name = name;
    this.value = value;
  }
}
