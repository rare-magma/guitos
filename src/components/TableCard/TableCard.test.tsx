import { render, screen } from "@testing-library/react";
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

  it("triggers onChange when user changes input", async () => {
    await userEvent.type(screen.getByDisplayValue("expense1"), "change name");

    expect(screen.getByDisplayValue("expense1change name")).toBeInTheDocument();

    await userEvent.type(screen.getByDisplayValue("$10"), "123");

    expect(screen.getByDisplayValue("$123")).toBeInTheDocument();
  });

  it("triggers onChange when user adds new item", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "add item to Expenses" }),
    );
  });

  it("triggers onChange when user deletes items", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "delete item 1" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "confirm item 1 deletion" }),
    );
  });
});
