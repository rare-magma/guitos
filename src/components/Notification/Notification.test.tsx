import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BudgetNotification } from "../../context/GeneralContext";
import { setNotificationsMock, undoMock } from "../../setupTests";
import { Notification } from "./Notification";

describe("Notification", () => {
  const notification: BudgetNotification = {
    show: true,
    id: "a",
    body: "notification body",
    showUndo: true,
  };

  const comp = <Notification notification={notification} />;

  beforeEach(() => {
    render(comp);
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    expect(screen.getByText("notification body")).toBeInTheDocument();
  });

  it("closes when close button is clicked", async () => {
    setNotificationsMock.mockClear();
    await userEvent.click(
      screen.getByRole("button", {
        name: "dismiss notification",
      }),
    );
    expect(setNotificationsMock).toHaveBeenCalledWith([]);
  });

  it("closes when undo button is clicked", async () => {
    undoMock.mockClear();
    await userEvent.click(
      screen.getByRole("button", {
        name: "undo budget deletion",
      }),
    );
    expect(undoMock).toHaveBeenCalled();
  });
});
