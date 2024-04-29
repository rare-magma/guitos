import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { itemForm1 } from "../../setupTests";
import { CalculateButton } from "./CalculateButton";

describe("CalculateButton", () => {
  const onCalculate = vi.fn();
  const comp = (
    <CalculateButton
      itemForm={itemForm1}
      label="Expense"
      onCalculate={onCalculate}
    />
  );

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", async () => {
    render(comp);
    expect(
      await screen.findByLabelText("select operation type to item value"),
    ).toBeInTheDocument();
  });

  it("opens popover when clicking the button", async () => {
    render(comp);
    await waitFor(async () => {
      const button = screen.getByRole("button", {
        name: "select operation type to item value",
      });
      await userEvent.click(button);
    });

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

  it.skip("closes when clicking the button", async () => {
    render(comp);
    await waitFor(async () => {
      const button = screen.getByRole("button", {
        name: "select operation type to item value",
      });
      await userEvent.click(button);

      await userEvent.click(button);

      const button2 = await screen.findByRole("button", {
        name: "select type of operation on item value",
      });

      expect(button2).not.toBeInTheDocument();
    });
  });

  it.skip("closes when pressing Escape key", async () => {
    render(comp);
    await waitFor(async () => {
      const button = screen.getByRole("button", {
        name: "select operation type to item value",
      });
      await userEvent.click(button);

      await userEvent.type(screen.getByLabelText("add"), "{Escape}");
      const button2 = await screen.findByRole("button", {
        name: "select type of operation on item value",
      });

      expect(button2).not.toBeInTheDocument();
    });
  });

  it("calls onCalculate when accepting change > 0", async () => {
    render(comp);
    await waitFor(async () => {
      const button = screen.getByRole("button", {
        name: "select operation type to item value",
      });
      await userEvent.click(button);
      const acceptButton = screen.getByRole("button", {
        name: "apply change to item value",
      });

      await userEvent.type(screen.getByLabelText("add"), "123");
      await userEvent.click(acceptButton);
    });

    expect(onCalculate).toHaveBeenCalledWith(123, "add");
  });

  it("calls onCalculate when change > 0 and enter is pressed", async () => {
    render(comp);
    await waitFor(async () => {
      const button = screen.getByRole("button", {
        name: "select operation type to item value",
      });
      await userEvent.click(button);
      await userEvent.type(screen.getByLabelText("add"), "123");
      await userEvent.type(screen.getByLabelText("add"), "{enter}");
    });

    expect(onCalculate).toHaveBeenCalledWith(123, "add");
  });

  it("calls onCalculate with sub", async () => {
    render(comp);
    await waitFor(async () => {
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
    });

    expect(onCalculate).toHaveBeenCalledWith(123, "subtract");
  });

  it("calls onCalculate with multiply", async () => {
    render(comp);
    await waitFor(async () => {
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
    });

    expect(onCalculate).toHaveBeenCalledWith(123, "multiply");
  });

  it("calls onCalculate with div", async () => {
    render(comp);
    await waitFor(async () => {
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
    });

    expect(onCalculate).toHaveBeenCalledWith(123, "divide");
  });

  it.skip("shows history when clicking button", async () => {
    render(comp);
    await waitFor(async () => {
      const button = screen.getByRole("button", {
        name: "select operation type to item value",
      });
      await userEvent.click(button);
      const historyButton = screen.getByRole("button", {
        name: "open operation history",
      });
      await userEvent.click(historyButton);
    });
  });
});
