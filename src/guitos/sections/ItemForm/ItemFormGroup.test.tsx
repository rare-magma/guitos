import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { BudgetMother } from "../../domain/budget.mother";
import { BudgetItemsMother } from "../../domain/budgetItem.mother";
import {
  configContextSpy,
  setBudgetMock,
  testSpanishConfigContext,
} from "../../../setupTests";
import { ItemFormGroup } from "./ItemFormGroup";

describe("ItemFormGroup", () => {
  const ref = createRef<HTMLInputElement>();
  const comp = (
    <BrowserRouter>
      <ItemFormGroup
        itemForm={BudgetItemsMother.itemForm1()}
        label="Expenses"
        inputRef={ref}
        costPercentage={1}
      />
    </BrowserRouter>
  );

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", async () => {
    render(comp);
    expect(await screen.findByDisplayValue("name1")).toBeInTheDocument();
    expect(await screen.findByDisplayValue("$10")).toBeInTheDocument();
  });

  it("reacts to user changing input", async () => {
    render(comp);
    setBudgetMock.mockClear();
    await userEvent.type(screen.getByDisplayValue("name1"), "change name");

    expect(screen.getByDisplayValue("name1change name")).toBeInTheDocument();
    expect(setBudgetMock).toHaveBeenCalledWith(
      {
        ...BudgetMother.testBudget(),
        expenses: {
          items: [{ id: 1, name: "name1change name", value: 10 }],
          total: 10,
        },
      },
      false,
    );

    setBudgetMock.mockClear();

    await userEvent.type(screen.getByDisplayValue("$10"), "123");

    expect(screen.getByDisplayValue("$123")).toBeInTheDocument();
    expect(setBudgetMock).toHaveBeenCalledWith(
      {
        ...BudgetMother.testBudget(),
        expenses: {
          items: [{ id: 1, name: "expense1", value: 123 }],
          total: 123,
        },
        stats: {
          ...BudgetMother.testBudget().stats,
          available: -23,
          withGoal: -33,
        },
      },
      false,
    );
  });

  it("removes item when user clicks delete confirmation button", async () => {
    render(comp);
    setBudgetMock.mockClear();
    await userEvent.click(
      screen.getByRole("button", { name: "delete item 1" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "confirm item 1 deletion" }),
    );

    expect(setBudgetMock).toHaveBeenCalledWith(
      {
        ...BudgetMother.testBudget(),
        expenses: { items: [], total: 0 },
        stats: {
          ...BudgetMother.testBudget().stats,
          available: 100,
          withGoal: 90,
        },
      },
      true,
    );
  });

  it("shows tooltip when user hovers over", async () => {
    render(comp);
    await userEvent.hover(screen.getByDisplayValue("$10"));

    expect(await screen.findByText("1% of revenue")).toBeInTheDocument();
  });

  it("opens popover when clicking the button", async () => {
    render(comp);
    await userEvent.click(
      screen.getByRole("button", {
        name: "select operation type to item value",
      }),
    );
    expect(
      screen.getByLabelText("select type of operation on item value"),
    ).toBeInTheDocument();
  });

  it("transforms decimal separator based on locale", async () => {
    cleanup();

    configContextSpy.mockReturnValue(testSpanishConfigContext);

    render(
      <BrowserRouter>
        <ItemFormGroup
          itemForm={BudgetItemsMother.itemForm1()}
          label="Expenses"
          inputRef={ref}
          costPercentage={1}
        />
        ,
      </BrowserRouter>,
    );

    await userEvent.clear(screen.getByDisplayValue("10 €"));
    await userEvent.type(screen.getByLabelText("item 1 value"), ",12");

    expect(screen.getByDisplayValue("0,12 €")).toBeInTheDocument();
  });
});
