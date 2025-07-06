import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { undoMock } from "../../../setupTests";
import type { BudgetNotification } from "../../context/NotificationContext";
import { Notification } from "./Notification";

describe("Notification", () => {
  const notification: BudgetNotification = {
    show: true,
    id: "a",
    body: "notification body",
    showUndo: true,
  };

  const handleClose = vi.fn();
  const comp = (
    <Notification notification={notification} handleClose={handleClose} />
  );

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    render(comp);
    expect(screen.getByText("notification body")).toBeInTheDocument();
  });

  it("closes when close button is clicked", async () => {
    render(comp);
    await userEvent.click(
      screen.getByRole("button", {
        name: "dismiss notification",
      }),
    );
    expect(handleClose).toHaveBeenCalled();
  });

  it("closes when undo button is clicked", async () => {
    render(comp);
    undoMock.mockClear();
    await userEvent.click(
      screen.getByRole("button", {
        name: "undo budget deletion",
      }),
    );
    expect(undoMock).toHaveBeenCalled();
  });
});
