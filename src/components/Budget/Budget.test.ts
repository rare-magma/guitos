import { itemForm1, itemForm2 } from "../../setupTests";
import { Budget } from "./Budget";

describe("Budget", () => {
  it("builds Budget", () => {
    const newBudget = new Budget({
      id: "035c2de4-01a4-403c-8f0e-f81340be9a4e",
      name: "2023-03",
      expenses: {
        items: [itemForm1, itemForm2],
        total: 1200,
      },
      incomes: {
        items: [itemForm1, itemForm2],
        total: 2100,
      },
      stats: {
        available: 900,
        withGoal: 690,
        saved: 210,
        goal: 10,
        reserves: 0,
      },
    });
    expect(JSON.stringify(newBudget)).toBe(
      '{"id":"035c2de4-01a4-403c-8f0e-f81340be9a4e","name":"2023-03","expenses":{"items":[{"id":1,"name":"name1","value":10},{"id":2,"name":"name2","value":100}],"total":1200},"incomes":{"items":[{"id":1,"name":"name1","value":10},{"id":2,"name":"name2","value":100}],"total":2100},"stats":{"available":900,"withGoal":690,"saved":210,"goal":10,"reserves":0}}',
    );
  });
  it("returns empty when there's no initialization", () => {
    const newBudget = new Budget();
    expect(JSON.stringify(newBudget)).toBe("{}");
  });
});
