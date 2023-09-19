import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { testBudget } from "../../setupTests";
import TableCard from "./TableCard";

describe("TableCard", () => {
  const onChange = vi.fn();
  const comp = (
    <TableCard
      items={testBudget.expenses}
      header={"Expenses"}
      onChange={onChange}
    />
  );

  beforeEach(() => {
    render(comp);
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });
  it("renders initial Expenses state", () => {
    expect(screen.getByDisplayValue("expense1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$10")).toBeInTheDocument();
  });

  it("renders initial Revenue state", () => {
    render(
      <TableCard
        items={testBudget.incomes}
        header={"Revenue"}
        onChange={onChange}
      />,
    );
    expect(screen.getByDisplayValue("income1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$100")).toBeInTheDocument();
  });

  it("triggers onChange when user changes input", async () => {
    await userEvent.type(screen.getByDisplayValue("expense1"), "change name");

    expect(onChange).toBeCalledWith({
      items: [
        {
          id: 1,
          name: "expense1change name",
          value: 10,
        },
      ],
      total: 10,
    });
    expect(screen.getByDisplayValue("expense1change name")).toBeInTheDocument();

    await userEvent.type(screen.getByDisplayValue("$10"), "123");

    expect(onChange).toBeCalledWith({
      items: [
        {
          id: 1,
          name: "expense1change name",
          value: 123,
        },
      ],
      total: 123,
    });
    expect(screen.getByDisplayValue("$123")).toBeInTheDocument();
  });

  it("triggers onChange when user adds new item", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "add item to Expenses" }),
    );

    expect(onChange).toBeCalledWith({
      items: [
        {
          id: 1,
          name: "expense1change name",
          value: 123,
        },
        {
          id: 2,
          name: "",
          value: 0,
        },
      ],
      total: 123,
    });
  });

  it("triggers onChange when user deletes items", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "delete item 1" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "confirm item 1 deletion" }),
    );

    expect(onChange).toBeCalledWith({
      items: [],
      total: 0,
    });
  });
});
