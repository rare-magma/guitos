import ChartsPage from "@guitos/sections/ChartsPage/ChartsPage";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("ChartsPage", () => {
  const onShowGraphs = vi.fn();
  const comp = <ChartsPage onShowGraphs={onShowGraphs} />;

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
    expect(screen.getByLabelText("go back to budgets")).toBeInTheDocument();
    expect(screen.getByText("Revenue vs expenses")).toBeInTheDocument();
    expect(screen.getByText("Savings")).toBeInTheDocument();
    expect(screen.getByText("Reserves")).toBeInTheDocument();
    expect(screen.getByText("Available vs with goal")).toBeInTheDocument();
    expect(screen.getByText("Savings goal")).toBeInTheDocument();
  });

  it("triggers onShowGraphs when back button is pressed", async () => {
    render(comp);
    await userEvent.click(screen.getByLabelText("go back to budgets"));
    expect(onShowGraphs).toHaveBeenCalledTimes(1);
    onShowGraphs.mockClear();
  });

  it("triggers onShowGraphs when i shortcut is pressed", async () => {
    render(comp);
    await userEvent.type(screen.getByText("Reserves"), "i");
    expect(onShowGraphs).toHaveBeenCalledTimes(1);
    onShowGraphs.mockClear();
  });
});
