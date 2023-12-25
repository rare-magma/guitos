import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  budgetContextSpy,
  testBudget,
  testEmptyBudgetContext,
} from "../../setupTests";
import { NavBar } from "./NavBar";

describe("NavBar", () => {
  const comp = <NavBar />;

  beforeEach(() => {
    render(comp);
  });

  it("matches snapshot", () => {
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", async () => {
    expect(screen.getByText("2023-03")).toBeInTheDocument();

    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
    await userEvent.click(newButton[0]);
    await userEvent.click(newButton[0]);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByLabelText("go to older budget")).toBeInTheDocument();
    expect(screen.getByLabelText("go to newer budget")).toBeInTheDocument();
  });

  it("triggers event when back/fwd buttons are pressed", async () => {
    await userEvent.click(screen.getByLabelText("go to older budget"));

    await userEvent.click(screen.getByLabelText("go to newer budget"));
  });

  it("triggers event when back/fwd shortcuts are pressed", async () => {
    await userEvent.type(screen.getByTestId("header"), "{pagedown}");

    await userEvent.type(screen.getByTestId("header"), "{home}");

    await userEvent.type(screen.getByTestId("header"), "{pageup}");
  });

  it("triggers event when clone button is pressed", async () => {
    await userEvent.click(screen.getByLabelText("clone budget"));
  });

  it("triggers event when import button is pressed", async () => {
    await userEvent.click(screen.getByLabelText("import budget"));
    await userEvent.upload(
      screen.getByTestId("import-form-control"),
      new File([testBudget as unknown as Blob], "budget"),
    );
  });

  it("triggers event when export shortcuts are pressed", async () => {
    await userEvent.type(screen.getByTestId("header"), "t");
    expect(
      screen.getByRole("button", {
        name: /export budget as csv/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /export budget as json/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /open guitos changelog/i,
      }),
    ).toBeInTheDocument();

    await userEvent.type(screen.getByTestId("header"), "s");

    await userEvent.type(screen.getByTestId("header"), "d");
  });

  it("triggers event when user changes budget name input", async () => {
    await userEvent.type(screen.getByDisplayValue("2023-03"), "change name");

    expect(screen.getByDisplayValue("2023-03change name")).toBeInTheDocument();
  });

  it("triggers event when user clicks delete budget button", async () => {
    await userEvent.click(screen.getByLabelText("delete budget"));
    await userEvent.click(
      screen.getByRole("button", { name: "confirm budget deletion" }),
    );
  });

  it("opens instructions in new tab", async () => {
    const instructionsButton = screen.getByLabelText(
      "open instructions in new tab",
    );
    await userEvent.click(instructionsButton);
    expect(instructionsButton).toHaveAttribute(
      "href",
      "https://github.com/rare-magma/guitos#getting-started",
    );
  });

  it("opens guitos repo in new tab", async () => {
    budgetContextSpy.mockReturnValue(testEmptyBudgetContext);
    render(comp);
    const guitosButton = screen.getByLabelText("open guitos repository");
    await userEvent.click(guitosButton);
    expect(guitosButton).toHaveAttribute(
      "href",
      "https://github.com/rare-magma/guitos",
    );
  });
});
