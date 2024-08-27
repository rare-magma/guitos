export default class BudgetItem {
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
}
