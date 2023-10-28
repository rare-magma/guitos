export class CsvItem {
  type!: "expense" | "income" | "goal" | "reserves";
  name!: string;
  value!: number;

  constructor(initializer?: CsvItem) {
    if (!initializer) return;
    if (initializer.type) this.type = initializer.type;
    if (initializer.name) this.name = initializer.name;
    if (initializer.value) this.value = initializer.value;
  }
}
