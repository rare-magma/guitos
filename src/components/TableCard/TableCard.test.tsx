import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableCard } from "./TableCard";

describe("TableCard", () => {
  const comp = <TableCard header={"Expenses"} />;

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
    render(<TableCard header={"Revenue"} />);
    expect(screen.getByDisplayValue("income1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$100")).toBeInTheDocument();
  });

  it("responds when user changes input", async () => {
    await userEvent.type(screen.getByDisplayValue("expense1"), "change name");

    expect(screen.getByDisplayValue("expense1change name")).toBeInTheDocument();

    await userEvent.type(screen.getByDisplayValue("$10"), "123");

    expect(screen.getByDisplayValue("$123")).toBeInTheDocument();
  });

  it("adds new Expense when user clicks adds new item button", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "add item to Expenses" }),
    );
    expect(screen.getByDisplayValue("$10")).toBeInTheDocument();
  });

  it("adds new Revenue when user clicks adds new item button", async () => {
    cleanup();
    render(<TableCard header={"Revenue"} />);
    await userEvent.click(
      screen.getByRole("button", { name: "add item to Revenue" }),
    );
    expect(screen.getByDisplayValue("$100")).toBeInTheDocument();
  });

  it("removes item when user clicks delete item button", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "delete item 1" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "confirm item 1 deletion" }),
    );
  });
});
