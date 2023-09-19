import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Notification from "./Notification";

describe("Notification", () => {
  const onShow = vi.fn();

  const notification = {
    show: true,
    id: "a",
    body: "notification body",
  };

  const comp = <Notification notification={notification} onShow={onShow} />;

  beforeEach(() => {
    render(comp);
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    expect(screen.getByText("notification body")).toBeInTheDocument();
  });

  it("triggers onShow when closed", async () => {
    await userEvent.click(screen.getByRole("button"));
    expect(onShow).toHaveBeenCalledTimes(1);
  });
});
