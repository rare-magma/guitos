import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import TableCard from "./TableCard";
import { testBudget } from "../setupTests";

describe("TableCard", () => {
  const onChange = vi.fn();

  beforeEach(() => {
    render(
      <TableCard
        items={testBudget.expenses}
        revenueTotal={0}
        header={"Expenses"}
        onChange={onChange}
      />
    );
  });
  it("renders initial state", () => {
    expect(screen.getByDisplayValue("name")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$10")).toBeInTheDocument();
  });

  it("triggers onChange when user changes input", async () => {
    await userEvent.type(screen.getByDisplayValue("name"), "change name");

    expect(onChange).toHaveBeenCalledTimes(11);
    expect(screen.getByDisplayValue("namechange name")).toBeInTheDocument();

    await userEvent.type(screen.getByDisplayValue("$10"), "123");

    expect(onChange).toHaveBeenCalledTimes(14);
    expect(screen.getByDisplayValue("$10,123")).toBeInTheDocument();
  });

  it("triggers onChange when user adds new item", async () => {
    await userEvent.click(screen.getAllByRole("button")[1]);

    expect(onChange).toHaveBeenCalledTimes(15);
  });

  it("triggers onChange when user deletes an item", async () => {
    await userEvent.click(screen.getAllByRole("button")[0]);

    expect(onChange).toHaveBeenCalledTimes(16);
  });
});
