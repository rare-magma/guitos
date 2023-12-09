import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {
  configContextSpy,
  itemForm1,
  testSpanishConfigContext,
} from "../../setupTests";
import { ItemFormGroup } from "./ItemFormGroup";

describe("ItemFormGroup", () => {
  const ref = React.createRef<HTMLInputElement>();
  const comp = (
    <ItemFormGroup
      itemForm={itemForm1}
      label="Expenses"
      inputRef={ref}
      costPercentage={1}
    />
  );

  beforeEach(() => {
    render(comp);
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });
  it("renders initial state", () => {
    expect(screen.getByDisplayValue("name1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$10")).toBeInTheDocument();
  });

  it("reacts to user changing input", async () => {
    await userEvent.type(screen.getByDisplayValue("name1"), "change name");
    expect(screen.getByDisplayValue("name1change name")).toBeInTheDocument();

    await userEvent.type(screen.getByDisplayValue("$10"), "123");
    expect(screen.getByDisplayValue("$123")).toBeInTheDocument();
  });

  it("removes item when user clicks delete confirmation button", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "delete item 1" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "confirm item 1 deletion" }),
    );
  });

  it("shows tooltip when user hovers over", async () => {
    await userEvent.hover(screen.getByDisplayValue("$10"));

    expect(await screen.findByText("1% of revenue")).toBeInTheDocument();
  });

  it("opens popover when clicking the button", async () => {
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
      <ItemFormGroup
        itemForm={itemForm1}
        label="Expenses"
        inputRef={ref}
        costPercentage={1}
      />,
    );

    await userEvent.clear(screen.getByDisplayValue("10 €"));
    await userEvent.type(screen.getByLabelText("item 1 value"), ",12");

    expect(screen.getByDisplayValue("0,12 €")).toBeInTheDocument();
  });
});
