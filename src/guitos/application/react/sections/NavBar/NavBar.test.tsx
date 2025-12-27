import { ConfigProvider } from "@guitos/application/react/context/ConfigContext";
import { NavBar } from "@guitos/application/react/sections/NavBar/NavBar";
import {
  budgetContextSpy,
  setBudgetMock,
  testEmptyBudgetContext,
} from "@guitos/application/react/setupTests";
import { BudgetMother } from "@guitos/contexts/budget/domain/budget.mother";
import { queryBus } from "@shared/infrastructure/buses";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const changelogRegex = /open guitos changelog/i;
const importRegex = /import budget/i;
const exportCsvRegex = /export budget as csv/i;
const exportJsonRegex = /export budget as json/i;

describe("NavBar", () => {
  const windowSpy = vi.spyOn(window, "open").mockImplementation(() => null);

  beforeEach(() => {
    windowSpy.mockClear();
  });

  const comp = (
    <ConfigProvider queryBus={queryBus}>
      <NavBar />
    </ConfigProvider>
  );

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", async () => {
    render(comp);
    expect(screen.getByText("2023-03")).toBeInTheDocument();

    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
    await userEvent.click(newButton[0]);
    await userEvent.click(newButton[0]);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByLabelText("go to older budget")).toBeInTheDocument();
    expect(screen.getByLabelText("go to newer budget")).toBeInTheDocument();
  });

  it.skip("triggers event when back/fwd buttons are pressed", async () => {
    render(comp);
    await userEvent.click(screen.getByLabelText("go to older budget"));

    await userEvent.click(screen.getByLabelText("go to newer budget"));
  });

  it.skip("triggers event when back/fwd shortcuts are pressed", async () => {
    render(comp);
    await userEvent.type(screen.getByTestId("header"), "{pagedown}");

    await userEvent.type(screen.getByTestId("header"), "{home}");

    await userEvent.type(screen.getByTestId("header"), "{pageup}");
  });

  it.skip("triggers event when clone button is pressed", async () => {
    render(comp);
    setBudgetMock.mockClear();
    await userEvent.click(screen.getByLabelText("clone budget"));
    expect(setBudgetMock).toHaveBeenCalledWith(
      BudgetMother.testBudgetClone(),
      true,
    );
  });

  it("triggers event when import button is pressed", async () => {
    render(comp);
    await userEvent.click(screen.getByLabelText("import or export budget"));
    const uploadEl = screen.getByTestId("import-form-control");
    await userEvent.upload(
      uploadEl,
      new File([JSON.stringify(BudgetMother.testBudget())], "budget", {
        type: "application/json",
      }),
    );
    expect((uploadEl as HTMLInputElement).files).toHaveLength(1);
  });

  it("triggers event when export shortcuts are pressed", async () => {
    render(comp);
    await userEvent.type(screen.getByTestId("header"), "o");
    expect(
      screen.getByRole("button", {
        name: importRegex,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: exportCsvRegex,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: exportJsonRegex,
      }),
    ).toBeInTheDocument();

    await userEvent.type(screen.getByTestId("header"), "s");

    await userEvent.type(screen.getByTestId("header"), "d");
  });

  it("triggers event when settings shortcuts are pressed", async () => {
    render(comp);
    await userEvent.type(screen.getByTestId("header"), "t");
    expect(
      screen.getByRole("link", {
        name: changelogRegex,
      }),
    ).toBeInTheDocument();
  });

  it("triggers event when user changes budget name input", async () => {
    render(comp);
    setBudgetMock.mockClear();
    await userEvent.type(screen.getByDisplayValue("2023-03"), "change name");

    expect(screen.getByDisplayValue("2023-03change name")).toBeInTheDocument();
    expect(setBudgetMock).toHaveBeenCalledWith(
      { ...BudgetMother.testBudget(), name: "2023-03change name" },
      false,
    );
  });

  it.skip("triggers event when user clicks delete budget button", async () => {
    render(comp);

    await waitFor(async () => {
      await userEvent.click(screen.getByLabelText("delete budget"));
      await userEvent.click(
        screen.getByRole("button", { name: "confirm budget deletion" }),
      );
    });
  });

  it("opens instructions in new tab", async () => {
    render(comp);
    const instructionsButton = screen.getByLabelText(
      "open instructions in new tab",
    );
    await userEvent.click(instructionsButton);
    expect(windowSpy).toHaveBeenCalled();
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
