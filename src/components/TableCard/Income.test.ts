import { itemForm1, itemForm2 } from "../../setupTests";
import { Income } from "./Income";

describe("Income", () => {
  it("builds Income", () => {
    const newIncome = new Income({
      items: [itemForm1, itemForm2],
      total: 110,
    });
    expect(JSON.stringify(newIncome)).toBe(
      '{"items":[{"id":1,"name":"name1","value":10},{"id":2,"name":"name2","value":100}],"total":110}',
    );
  });
  it("returns empty when there's no initialization", () => {
    const newIncome = new Income();
    expect(JSON.stringify(newIncome)).toBe('{"items":[],"total":0}');
  });
});
