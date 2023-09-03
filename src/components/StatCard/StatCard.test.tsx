import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import StatCard from "./StatCard";

describe("StatCard", () => {
  const onChange = vi.fn();
  const onAutoGoal = vi.fn();
  const onShowGraphs = vi.fn();
  const comp = (
    <StatCard
      onChange={onChange}
      onAutoGoal={onAutoGoal}
      onShowGraphs={onShowGraphs}
    />
  );

  beforeEach(() => {
    render(comp);
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    expect(screen.getByText("Statistics")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$90")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$80")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$10")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
  });

  it("triggers onChange when user changes input", async () => {
    await userEvent.type(screen.getByLabelText("reserves"), "2");

    expect(onChange).toBeCalledWith({
      available: 90,
      goal: 10,
      reserves: 2,
      saved: 10,
      withGoal: 80,
    });
    expect(screen.getByDisplayValue("$2")).toBeInTheDocument();

    await userEvent.clear(screen.getByTestId("goal-input"));
    await userEvent.type(screen.getByTestId("goal-input"), "95");

    expect(onChange).toBeCalledWith({
      available: 90,
      goal: 95,
      reserves: 2,
      saved: 10,
      withGoal: 80,
    });
    expect(screen.getByDisplayValue("95")).toBeInTheDocument();
  });

  it("triggers onAutoGoal when user clicks button", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "calculate savings goal" }),
    );

    expect(onAutoGoal).toBeCalledWith({
      available: 90,
      goal: 95,
      reserves: 2,
      saved: 10,
      withGoal: 80,
    });
  });

  it("triggers onShowGraphs when user clicks button", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "open charts view" }),
    );

    expect(onShowGraphs).toBeCalledTimes(1);
  });
});
