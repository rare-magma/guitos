import { Stat } from "./Stat";

describe("Stat", () => {
  it("builds Stat", () => {
    const newStat = new Stat({
      available: 900,
      withGoal: 690,
      saved: 210,
      goal: 10,
      reserves: 1,
    });
    expect(JSON.stringify(newStat)).toBe(
      '{"available":900,"withGoal":690,"saved":210,"goal":10,"reserves":1}',
    );
  });
  it("returns empty when there's no initialization", () => {
    const newStat = new Stat();
    expect(JSON.stringify(newStat)).toBe("{}");
  });
});
