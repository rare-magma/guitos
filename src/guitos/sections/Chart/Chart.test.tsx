import { BudgetMother } from "@guitos/domain/budget.mother";
import { Chart, sortChartDataByName } from "@guitos/sections/Chart/Chart";
import { render, screen } from "@testing-library/react";
import { Uuid } from "@shared/domain/uuid";
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

  it("renders initial state", () => {
    render(comp);
    expect(screen.getByText("chart header")).toBeInTheDocument();
    expect(screen.getByText("median revenue")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$200")).toBeInTheDocument();
  });

  it("renders total value for filtered data", () => {
    render(
      <Chart
        header={"filtered expenses"}
        filteredData={[
          {
            id: Uuid.random(),
            name: "2023-03",
            item: "rent",
            value: 100,
            type: "Expenses",
          },
          {
            id: Uuid.random(),
            name: "2023-04",
            item: "rent",
            value: 200,
            type: "Expenses",
          },
        ]}
        legendValues1={[100, 200]}
        totalValues1={[100, 200]}
        areaDataKey1={"value"}
        areaStroke1={"yellow"}
        areaFill1={"orange"}
        legend1={"median value"}
        totalLegend1={"total value"}
      />,
    );

    expect(screen.getByText("total value")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$300")).toBeInTheDocument();
  });

  it("sorts filtered chart data by date label", () => {
    const sortedData = sortChartDataByName([
      {
        id: Uuid.random(),
        name: "2023-10",
        item: "rent",
        value: 300,
        type: "Expenses",
      },
      {
        id: Uuid.random(),
        name: "2023-03",
        item: "rent",
        value: 100,
        type: "Expenses",
      },
      {
        id: Uuid.random(),
        name: "2023-04",
        item: "rent",
        value: 200,
        type: "Expenses",
      },
    ]);

    expect(sortedData.map((item) => item.name)).toEqual([
      "2023-03",
      "2023-04",
      "2023-10",
    ]);
  });
});
