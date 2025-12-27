import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import { Chart } from "@guitos/sections/Chart/Chart";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Chart", () => {
  const comp = (
    <Chart
      header={"chart header"}
      tooltipKey1={"tooltipKey1"}
      areaDataKey1={"revenue"}
      areaStroke1={"highlight"}
      areaFill1={"highlight"}
      legend1={"median revenue"}
      legendValues1={BudgetMother.testBudgetList().map((b) => {
        return b.incomes.total;
      })}
    />
  );

  beforeEach(() => {
    //@ts-expect-error
    window.ResizeObserver = undefined;
    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    vi.restoreAllMocks();
  });

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    render(comp);
    expect(screen.getByText("chart header")).toBeInTheDocument();
    expect(screen.getByText("median revenue")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$200")).toBeInTheDocument();
  });
});
