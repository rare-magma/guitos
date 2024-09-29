import { describe, expect, it } from "vitest";
import { UserOptionsMother } from "./userOptions.mother";

describe("Options", () => {
  it("should throw an error if the currency code is invalid", () => {
    expect(() => {
      UserOptionsMother.invalid();
    }).toThrowError();
  });
});
