import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import TableCard from "./TableCard";
import { testIntlConfig, testBudget } from "../../setupTests";

describe("TableCard", () => {
  const onChange = vi.fn();

  beforeEach(() => {
    render(
      <TableCard
        items={testBudget.expenses}
        intlConfig={testIntlConfig}
        revenueTotal={0}
        header={"Expenses"}
        onChange={onChange}
      />
    );
  });
  it("renders initial Expenses state", () => {
    expect(screen.getByDisplayValue("expense1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$10")).toBeInTheDocument();
  });

  it("renders initial Revenue state", () => {
    render(
      <TableCard
        items={testBudget.incomes}
        intlConfig={testIntlConfig}
        revenueTotal={0}
        header={"Revenue"}
        onChange={onChange}
      />
    );
    expect(screen.getByDisplayValue("income1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$100")).toBeInTheDocument();
  });

  it("triggers onChange when user changes input", async () => {
    await userEvent.type(screen.getByDisplayValue("expense1"), "change name");

    expect(onChange).toHaveBeenCalledTimes(11);
    expect(screen.getByDisplayValue("expense1change name")).toBeInTheDocument();

    await userEvent.type(screen.getByDisplayValue("$10"), "123");

    expect(onChange).toHaveBeenCalledTimes(14);
    expect(screen.getByDisplayValue("$10,123")).toBeInTheDocument();
  });

  it("triggers onChange when user adds new item", async () => {
    await userEvent.click(screen.getByRole("button", { name: "add item" }));

    expect(onChange).toHaveBeenCalledTimes(15);
  });

  it("triggers onChange when user deletes an item", async () => {
    await userEvent.click(screen.getByRole("button", { name: "delete item" }));
    await userEvent.click(
      screen.getByRole("button", { name: "confirm item deletion" })
    );

    expect(onChange).toHaveBeenCalledTimes(16);
  });
});
