import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { itemForm1 } from "../../setupTests";
import CalculateButton from "./CalculateButton";

describe("CalculateButton", () => {
  const onCalculate = vi.fn();
  const comp = (
    <CalculateButton
      itemForm={itemForm1}
      label="Expense"
      onCalculate={onCalculate}
    />
  );

  beforeEach(() => {
    render(comp);
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    expect(
      screen.getByLabelText("select operation type to item value"),
    ).toBeInTheDocument();
  });

  it("opens popover when clicking the button", async () => {
    const button = screen.getByRole("button", {
      name: "select operation type to item value",
    });
    await userEvent.click(button);

    expect(
      screen.getByRole("button", {
        name: "select type of operation on item value",
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("addition")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "apply change to item value",
      }),
    ).toBeInTheDocument();
  });

  it("closes when clicking the button", async () => {
    const button = screen.getByRole("button", {
      name: "select operation type to item value",
    });
    await userEvent.click(button);

    const button2 = screen.getByRole("button", {
      name: "select type of operation on item value",
    });

    await userEvent.click(button);

    expect(button2).not.toBeInTheDocument();
  });

  it("closes when pressing Escape key", async () => {
    const button = screen.getByRole("button", {
      name: "select operation type to item value",
    });
    await userEvent.click(button);

    const button2 = screen.getByRole("button", {
      name: "select type of operation on item value",
    });

    await userEvent.type(screen.getByLabelText("addition"), "{Escape}");

    expect(button2).not.toBeInTheDocument();
  });

  it("calls onCalculate when accepting change > 0", async () => {
    const button = screen.getByRole("button", {
      name: "select operation type to item value",
    });
    await userEvent.click(button);
    const acceptButton = screen.getByRole("button", {
      name: "apply change to item value",
    });

    await userEvent.type(screen.getByLabelText("add"), "123");
    await userEvent.click(acceptButton);

    expect(onCalculate).toBeCalledWith(123, "add");
  });

  it("calls onCalculate when change > 0 and enter is pressed", async () => {
    const button = screen.getByRole("button", {
      name: "select operation type to item value",
    });
    await userEvent.click(button);
    await userEvent.type(screen.getByLabelText("addition"), "123");
    await userEvent.type(screen.getByLabelText("addition"), "{enter}");

    expect(onCalculate).toBeCalledWith(123, "add");
  });

  it("calls onCalculate with sub", async () => {
    const button = screen.getByRole("button", {
      name: "select operation type to item value",
    });
    await userEvent.click(button);
    const acceptButton = screen.getByRole("button", {
      name: "apply change to item value",
    });

    await userEvent.type(screen.getByLabelText("add"), "123");

    await userEvent.click(screen.getByLabelText("subtraction"));
    await userEvent.click(acceptButton);

    expect(onCalculate).toBeCalledWith(123, "subtract");
  });

  it("calls onCalculate with multiply", async () => {
    const button = screen.getByRole("button", {
      name: "select operation type to item value",
    });
    await userEvent.click(button);
    const acceptButton = screen.getByRole("button", {
      name: "apply change to item value",
    });

    await userEvent.type(screen.getByLabelText("add"), "123");

    await userEvent.click(screen.getByLabelText("multiplication"));
    await userEvent.click(acceptButton);

    expect(onCalculate).toBeCalledWith(123, "multiply");
  });

  it("calls onCalculate with div", async () => {
    const button = screen.getByRole("button", {
      name: "select operation type to item value",
    });
    await userEvent.click(button);
    const acceptButton = screen.getByRole("button", {
      name: "apply change to item value",
    });

    await userEvent.type(screen.getByLabelText("add"), "123");

    await userEvent.click(screen.getByLabelText("division"));
    await userEvent.click(acceptButton);

    expect(onCalculate).toBeCalledWith(123, "divide");
  });
});
