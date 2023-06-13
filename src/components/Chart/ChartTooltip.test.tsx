import { render, screen } from "@testing-library/react";
import { testIntlConfig } from "../../setupTests";
import ChartTooltip from "./ChartTooltip";

describe("ChartTooltip", () => {
  beforeEach(() => {
    render(
      <ChartTooltip
        active={true}
        label="label"
        payload={[{ name: "name", value: 123, unit: "$" }]}
        intlConfig={testIntlConfig}
      />
    );
  });

  it("renders initial state", () => {
    expect(screen.getByText("label")).toBeInTheDocument();
    expect(screen.getByText("$123.00")).toBeInTheDocument();
  });
  it("renders goal with %", () => {
    render(
      <ChartTooltip
        active={true}
        label="goal"
        payload={[{ name: "goal", value: 123, unit: "%" }]}
        key1="goal"
        intlConfig={testIntlConfig}
      />
    );
    expect(screen.getByText("123%")).toBeInTheDocument();
  });

  it("renders 2 legends", () => {
    render(
      <ChartTooltip
        active={true}
        payload={[
          { name: "revenue", value: 456, unit: "$" },
          { name: "expenses", value: 789, unit: "$" },
        ]}
        key1="revenue"
        key2="expenses"
        intlConfig={testIntlConfig}
      />
    );
    expect(screen.getByText("$456.00")).toBeInTheDocument();
    expect(screen.getByText("$789.00")).toBeInTheDocument();
  });
});
