import { render, screen } from "@testing-library/react";
import { ChartTooltip } from "./ChartTooltip";

describe("ChartTooltip", () => {
  const comp = (
    <ChartTooltip
      active={true}
      label="label"
      payload={[{ name: "name", value: 123, unit: "$" }]}
    />
  );

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    render(comp);
    expect(screen.getByText("label")).toBeInTheDocument();
    expect(screen.getByText("$123.00")).toBeInTheDocument();
  });

  it("renders goal with %", () => {
    render(comp);
    render(
      <ChartTooltip
        active={true}
        label="goal"
        payload={[{ name: "goal", value: 123, unit: "%" }]}
        key1="goal"
      />,
    );
    expect(screen.getByText("123%")).toBeInTheDocument();
  });

  it("renders 2 legends", () => {
    render(comp);
    render(
      <ChartTooltip
        active={true}
        payload={[
          { name: "revenue", value: 456, unit: "$" },
          { name: "expenses", value: 789, unit: "$" },
        ]}
        key1="revenue"
        key2="expenses"
      />,
    );
    expect(screen.getByText("$456.00")).toBeInTheDocument();
    expect(screen.getByText("$789.00")).toBeInTheDocument();
  });
});
