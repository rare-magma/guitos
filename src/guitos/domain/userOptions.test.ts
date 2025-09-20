import { UserOptionsMother } from "@guitos/domain/userOptions.mother";
import { describe, expect, it } from "vitest";

describe("Options", () => {
  it("should throw an error if the currency code is invalid", () => {
    expect(() => {
      UserOptionsMother.invalid();
    }).toThrowError();
  });
});
