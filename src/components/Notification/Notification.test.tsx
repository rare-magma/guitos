import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { BudgetNotification, Notification } from "./Notification";

describe("Notification", () => {
  const onShow = vi.fn();

  const notification: BudgetNotification = {
    show: true,
    id: "a",
    body: "notification body",
    showUndo: true,
  };

  const comp = <Notification notification={notification} onShow={onShow} />;

  beforeEach(() => {
    onShow.mockClear();
    render(comp);
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    expect(screen.getByText("notification body")).toBeInTheDocument();
  });

  it("triggers onShow when closed", async () => {
    await userEvent.click(
      screen.getByRole("button", {
        name: "dismiss notification",
      }),
    );
    expect(onShow).toHaveBeenCalled();
  });

  it("triggers onShow when undo button is clicked", async () => {
    await userEvent.click(
      screen.getByRole("button", {
        name: "undo budget deletion",
      }),
    );
    expect(onShow).toHaveBeenCalled();
  });
});
