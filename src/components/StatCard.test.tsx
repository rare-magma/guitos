import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { testBudget } from "../setupTests";
import StatCard from "./StatCard";

describe("StatCard", () => {
  const onChange = vi.fn();

  beforeEach(() => {
    render(<StatCard stat={testBudget.stats} onChange={onChange} />);
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

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByDisplayValue("$2,002")).toBeInTheDocument();

    await userEvent.clear(screen.getByTestId("goal-input"));
    await userEvent.type(screen.getByTestId("goal-input"), "95");

    expect(onChange).toHaveBeenCalledTimes(5);
    expect(screen.getByDisplayValue("95")).toBeInTheDocument();
  });
});