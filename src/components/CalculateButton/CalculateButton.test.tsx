import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CalculateButton from "./CalculateButton";
import { vi } from "vitest";
import { testIntlConfig, itemForm1 } from "../../setupTests";

describe("CalculateButton", () => {
  const onCalculate = vi.fn();
  const comp = (
    <CalculateButton
      itemForm={itemForm1}
      intlConfig={testIntlConfig}
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
      screen.getByLabelText("select operations to change item value amount"),
    ).toBeInTheDocument();
  });

  it("opens popover when clicking the button", async () => {
    const button = screen.getByRole("button", {
      name: "select operations to change item value amount",
    });
    await userEvent.click(button);

    expect(
      screen.getByRole("button", {
        name: "select type of operation on item value",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("change item value amount"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "accept change item value amount",
      }),
    ).toBeInTheDocument();
  });

  it("closes when clicking the button", async () => {
    const button = screen.getByRole("button", {
      name: "select operations to change item value amount",
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
      name: "select operations to change item value amount",
    });
    await userEvent.click(button);

    const button2 = screen.getByRole("button", {
      name: "select type of operation on item value",
    });

    await userEvent.type(
      screen.getByLabelText("change item value amount"),
      "{Escape}",
    );

    expect(button2).not.toBeInTheDocument();
  });

  it("calls onCalculate when accepting change > 0", async () => {
    const button = screen.getByRole("button", {
      name: "select operations to change item value amount",
    });
    await userEvent.click(button);
    const acceptButton = screen.getByRole("button", {
      name: "accept change item value amount",
    });

    await userEvent.type(
      screen.getByLabelText("change item value amount"),
      "123",
    );
    await userEvent.click(acceptButton);

    expect(onCalculate).toBeCalledWith(123, "add");
  });

  it("calls onCalculate when change > 0 and enter is pressed", async () => {
    const button = screen.getByRole("button", {
      name: "select operations to change item value amount",
    });
    await userEvent.click(button);
    await userEvent.type(
      screen.getByLabelText("change item value amount"),
      "123",
    );
    await userEvent.type(
      screen.getByLabelText("change item value amount"),
      "{enter}",
    );

    expect(onCalculate).toBeCalledWith(123, "add");
  });

  it("calls onCalculate with sub", async () => {
    const button = screen.getByRole("button", {
      name: "select operations to change item value amount",
    });
    await userEvent.click(button);
    const acceptButton = screen.getByRole("button", {
      name: "accept change item value amount",
    });

    await userEvent.type(
      screen.getByLabelText("change item value amount"),
      "123",
    );

    await userEvent.click(screen.getByLabelText("subtract to item value"));
    await userEvent.click(acceptButton);

    expect(onCalculate).toBeCalledWith(123, "sub");
  });

  it("calls onCalculate with mul", async () => {
    const button = screen.getByRole("button", {
      name: "select operations to change item value amount",
    });
    await userEvent.click(button);
    const acceptButton = screen.getByRole("button", {
      name: "accept change item value amount",
    });

    await userEvent.type(
      screen.getByLabelText("change item value amount"),
      "123",
    );

    await userEvent.click(screen.getByLabelText("multiply item value"));
    await userEvent.click(acceptButton);

    expect(onCalculate).toBeCalledWith(123, "mul");
  });

  it("calls onCalculate with div", async () => {
    const button = screen.getByRole("button", {
      name: "select operations to change item value amount",
    });
    await userEvent.click(button);
    const acceptButton = screen.getByRole("button", {
      name: "accept change item value amount",
    });

    await userEvent.type(
      screen.getByLabelText("change item value amount"),
      "123",
    );

    await userEvent.click(screen.getByLabelText("divide item value"));
    await userEvent.click(acceptButton);

    expect(onCalculate).toBeCalledWith(123, "div");
  });
});
