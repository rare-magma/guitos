import type Big from "big.js";

type CsvType = "expense" | "income" | "goal" | "reserves";

export class CsvItem {
  type: CsvType;
  name: string;
  value: Big;

  constructor(type: CsvType, name: string, value: Big) {
    this.type = type;
    this.name = name;
    this.value = value;
  }
}
