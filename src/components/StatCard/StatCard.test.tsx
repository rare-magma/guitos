import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { setBudgetMock, testBudget } from "../../setupTests";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  const onShowGraphs = vi.fn();
  const comp = <StatCard onShowGraphs={onShowGraphs} />;

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    render(comp);
    expect(screen.getByText("Statistics")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$90")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$80")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$10")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
  });

  it("triggers onChange when user changes input", async () => {
    render(comp);
    setBudgetMock.mockClear();
    await waitFor(async () => {
      await userEvent.type(screen.getByLabelText("reserves"), "2");
    });

    expect(setBudgetMock).toHaveBeenCalledWith(
      { ...testBudget, stats: { ...testBudget.stats, reserves: 2 } },
      false,
    );
    expect(screen.getByDisplayValue("$2")).toBeInTheDocument();

    await waitFor(async () => {
      await userEvent.clear(screen.getByTestId("goal-input"));
      await userEvent.type(screen.getByTestId("goal-input"), "95");
    });
    expect(setBudgetMock).toHaveBeenCalledWith(
      {
        ...testBudget,
        stats: { ...testBudget.stats, goal: 95, saved: 95, withGoal: -5 },
      },
      false,
    );

    expect(screen.getByDisplayValue("95")).toBeInTheDocument();
  });

  it("triggers onAutoGoal when user clicks button", async () => {
    render(comp);
    setBudgetMock.mockClear();
    await waitFor(async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "calculate savings goal" }),
      );
    });
    expect(setBudgetMock).toHaveBeenCalledWith(
      {
        ...testBudget,
        stats: { ...testBudget.stats, goal: 90, saved: 90, withGoal: 0 },
      },
      true,
    );
  });

  it("triggers onShowGraphs when user clicks button", async () => {
    render(comp);

    await waitFor(async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "open charts view" }),
      );
    });

    expect(onShowGraphs).toHaveBeenCalledTimes(1);
  });
});
