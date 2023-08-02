import { CsvItem } from "./CsvItem";

describe("CsvItem", () => {
  it("builds CsvItem", () => {
    const newCsvItem = new CsvItem({
      type: "expense",
      name: "expense1",
      value: 2,
    });
    expect(JSON.stringify(newCsvItem)).toBe(
      '{"type":"expense","name":"expense1","value":2}',
    );
  });
  it("returns empty when there's no initialization", () => {
    const newCsvItem = new CsvItem();
    expect(JSON.stringify(newCsvItem)).toBe("{}");
  });
});
