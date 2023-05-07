import { ItemForm } from "./ItemForm";

describe("ItemForm", () => {
  it("builds ItemForm", () => {
    const newItemForm2 = new ItemForm({
      id: 1,
      name: "a",
      value: 2,
    });
    expect(JSON.stringify(newItemForm2)).toBe('{"id":1,"name":"a","value":2}');
  });
});
