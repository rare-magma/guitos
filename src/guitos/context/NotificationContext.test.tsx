import {
  NotificationProvider,
  useNotificationContext,
} from "@guitos/context/NotificationContext";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function TestNotificationComponent() {
  const { notifications, setNotifications } = useNotificationContext();

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setNotifications([
            {
              show: true,
              body: "notification",
            },
          ])
        }
      >
        Set Notification
      </button>
      <p data-testid="notifications">
        {notifications.map((n) => n.body).toString()}
      </p>
    </>
  );
}

describe("NotificationContext", () => {
  it("sets and displays notifications", () => {
    render(
      <NotificationProvider>
        <TestNotificationComponent />
      </NotificationProvider>,
    );
    act(() => {
      screen.getByText("Set Notification").click();
    });
    expect(screen.getByTestId("notifications").textContent).toBe(
      "notification",
    );
  });
});
