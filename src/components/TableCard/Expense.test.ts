import { itemForm1, itemForm2 } from "../../setupTests";
import { Expense } from "./Expense";

describe("Expense", () => {
  it("builds Expense", () => {
    const newExpense = new Expense({
      items: [itemForm1, itemForm2],
      total: 110,
    });
    expect(JSON.stringify(newExpense)).toBe(
      '{"items":[{"id":1,"name":"name1","value":10},{"id":2,"name":"name2","value":100}],"total":110}',
    );
  });
  it("returns empty when there's no initialization", () => {
    const newExpense = new Expense();
    expect(JSON.stringify(newExpense)).toBe('{"items":[],"total":0}');
  });
});
