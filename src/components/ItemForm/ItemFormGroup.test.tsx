import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ItemFormGroup from "./ItemFormGroup";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import {
  testIntlConfig,
  itemForm1,
  testSpanishIntlConfig,
} from "../../setupTests";
import React from "react";

describe("ItemFormGroup", () => {
  const onRemove = vi.fn();
  const onChange = vi.fn();
  const ref = React.createRef<HTMLInputElement>();

  beforeEach(() => {
    render(
      <ItemFormGroup
        itemForm={itemForm1}
        label="Expenses"
        inputRef={ref}
        intlConfig={testIntlConfig}
        costPercentage={1}
        onRemove={onRemove}
        onChange={onChange}
      />,
    );
  });

  it("renders initial state", () => {
    expect(screen.getByDisplayValue("name1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("$10")).toBeInTheDocument();
  });

  it("triggers onChange when user changes input", async () => {
    await userEvent.type(screen.getByDisplayValue("name1"), "change name");

    expect(onChange).toBeCalledWith({
      id: 1,
      name: "name1change name",
      value: 10,
    });
    expect(screen.getByDisplayValue("name1change name")).toBeInTheDocument();

    await userEvent.type(screen.getByDisplayValue("$10"), "123");

    expect(onChange).toBeCalledWith({
      id: 1,
      name: "name1change name",
      value: 123,
    });
    expect(screen.getByDisplayValue("$123")).toBeInTheDocument();
  });

  it("triggers onRemove when user clicks delete confirmation button", async () => {
    await userEvent.click(
      screen.getByRole("button", { name: "delete item 1" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "confirm item 1 deletion" }),
    );

    expect(onRemove).toBeCalledWith({
      id: 1,
      name: "name1change name",
      value: 123,
    });
  });

  it("shows tooltip when user hovers over", async () => {
    fireEvent.mouseOver(screen.getByDisplayValue("$123"));

    expect(await screen.findByText("1% of revenue")).toBeInTheDocument();
  });

  it("opens popover when clicking the button", async () => {
    await userEvent.click(
      screen.getByRole("button", {
        name: "select operations to change item value amount",
      }),
    );

    expect(
      screen.getByLabelText("select type of operation on item value"),
    ).toBeInTheDocument();
  });

  it("transforms decimal separator based on locale", async () => {
    cleanup();

    render(
      <ItemFormGroup
        itemForm={itemForm1}
        label="Expenses"
        inputRef={ref}
        intlConfig={testSpanishIntlConfig}
        costPercentage={1}
        onRemove={onRemove}
        onChange={onChange}
      />,
    );

    await userEvent.clear(screen.getByDisplayValue("123 €"));
    await userEvent.type(screen.getByLabelText("item 1 value"), "123,12");

    expect(screen.getByDisplayValue("123,12 €")).toBeInTheDocument();

    expect(onChange).toBeCalledWith({
      id: 1,
      name: "name1change name",
      value: 123.12,
    });
  });
});
