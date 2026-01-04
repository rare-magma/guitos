type CsvType = "expense" | "income" | "goal" | "reserves";

export class CsvItem {
  type: CsvType;
  name: string;
  amount: number;

  constructor(type: CsvType, name: string, amount: number) {
    this.type = type;
    this.name = name;
    this.amount = amount;
  }
}
