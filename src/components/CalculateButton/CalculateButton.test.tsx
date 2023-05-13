import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CalculateButton from "./CalculateButton";
import { vi } from "vitest";
import { testIntlConfig, itemForm1 } from "../../setupTests";

describe("CalculateButton", () => {
  const onCalculate = vi.fn();
  const onShow = vi.fn();

  beforeEach(() => {
    render(
      <CalculateButton
        itemForm={itemForm1}
        intlConfig={testIntlConfig}
        onCalculate={onCalculate}
        onShow={onShow}
      />
    );
  });

  it.todo("renders initial state", () => {
    expect(
      screen.getByLabelText("select operations to change item value amount")
    ).toBeInTheDocument();
  });

  it.todo("opens popover when clicking the button", async () => {
    await userEvent.click(
      screen.getByRole("button", {
        name: "select operations to change item value amount",
      })
    );

    expect(onShow).toHaveBeenCalledTimes(1);
  });

  it.todo("closes when clicking the button", async () => {
    await userEvent.click(
      screen.getByRole("button", {
        name: "select operations to change item value amount",
      })
    );

    await userEvent.click(
      screen.getByRole("button", {
        name: "accept change item value amount",
      })
    );

    expect(onShow).toHaveBeenCalledTimes(2);
  });

  it.todo("closes when presing Escape key", async () => {
    await userEvent.click(
      screen.getByRole("button", {
        name: "select operations to change item value amount",
      })
    );

    await userEvent.type(
      screen.getByLabelText("change item value amount"),
      "{Escape}"
    );
    expect(onShow).toHaveBeenCalledTimes(4);
  });
});
