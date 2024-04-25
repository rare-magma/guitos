import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { testBudgetList } from "../../setupTests";
import { Budget } from "../Budget/Budget";
import { Chart } from "./Chart";

describe("Chart", () => {
  const comp = (
    <Chart
      header={"chart header"}
      tooltipKey1={"tooltipKey1"}
      areaDataKey1={"revenue"}
      areaStroke1={"highlight"}
      areaFill1={"highlight"}
      legend1={"median revenue"}
      legendValues1={testBudgetList.map((b: Budget) => {
        return b.incomes.total;
      })}
    />
  );

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    delete window.ResizeObserver;
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
