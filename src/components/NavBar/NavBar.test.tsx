import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import NavBar from "./NavBar";
import { budgetNameList, testIntlConfig, testBudget } from "../../setupTests";

describe("NavBar", () => {
  const onClone = vi.fn();
  const onExport = vi.fn();
  const onGoBack = vi.fn();
  const onGoHome = vi.fn();
  const onGoForward = vi.fn();
  const onImport = vi.fn();
  const onNew = vi.fn();
  const onRemove = vi.fn();
  const onRename = vi.fn();
  const onSelect = vi.fn();
  const onSetCurrency = vi.fn();

  beforeEach(() => {
    render(
      <NavBar
        budgetNameList={budgetNameList}
        currency={testIntlConfig.currency}
        selected={"2023-04"}
        id={"035c2de4-00a4-403c-8f0e-f81339be9a4e"}
        onClone={onClone}
        onExport={onExport}
        onGoBack={onGoBack}
        onGoHome={onGoHome}
        onGoForward={onGoForward}
        onImport={onImport}
        onNew={onNew}
        onRemove={onRemove}
        onRename={onRename}
        onSelect={onSelect}
        onSetCurrency={onSetCurrency}
      />
    );
  });

  it("renders initial state", async () => {
    expect(screen.getByText("2023-04")).toBeInTheDocument();

    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
    await userEvent.click(newButton[0]);
    await userEvent.click(newButton[0]);

    expect(
      screen.getByPlaceholderText("Search list of budgets...")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("go to older budget")).toBeInTheDocument();
    expect(screen.getByLabelText("go to newer budget")).toBeInTheDocument();
  });

  it("triggers onGo* when back/fwd buttons are pressed", async () => {
    await userEvent.click(screen.getByLabelText("go to older budget"));
    expect(onGoBack).toBeCalledTimes(1);
    onGoBack.mockClear();

    await userEvent.click(screen.getByLabelText("go to newer budget"));
    expect(onGoForward).toBeCalledTimes(1);
    onGoForward.mockClear();
  });

  it("triggers onGo* when back/fwd shortcuts are pressed", async () => {
    await userEvent.type(screen.getByTestId("header"), "{pagedown}");
    expect(onGoBack).toBeCalledTimes(1);

    await userEvent.type(screen.getByTestId("header"), "{home}");
    expect(onGoHome).toBeCalledTimes(1);

    await userEvent.type(screen.getByTestId("header"), "{pageup}");
    expect(onGoForward).toBeCalledTimes(1);
  });

  it("triggers onClone when clone button is pressed", async () => {
    await userEvent.click(screen.getByLabelText("clone budget"));
    expect(onClone).toBeCalledTimes(1);
  });

  it("triggers onImport when import button is pressed", async () => {
    await userEvent.click(screen.getByLabelText("import budget"));
    await userEvent.upload(
      screen.getByTestId("import-form-control"),
      testBudget as unknown as File
    );
    expect(onImport).toBeCalledTimes(1);
  });

  it("triggers onExport when export json button is pressed", async () => {
    await userEvent.click(screen.getByLabelText("export budget"));
    await userEvent.click(
      screen.getByRole("button", { name: "export budget as json" })
    );
    expect(onExport).toBeCalledWith("json");
  });

  it("triggers onExport when export csv button is pressed", async () => {
    await userEvent.click(screen.getByLabelText("export budget"));
    await userEvent.click(
      screen.getByRole("button", { name: "export budget as csv" })
    );
    expect(onExport).toBeCalledWith("csv");
  });

  it("triggers onRename when user changes budget name input", async () => {
    await userEvent.type(screen.getByDisplayValue("2023-04"), "change name");

    expect(onRename).toBeCalledWith("2023-04change name");
    expect(screen.getByDisplayValue("2023-04change name")).toBeInTheDocument();
  });

  it("triggers onRemove when user clicks delete budget button", async () => {
    await userEvent.click(screen.getByLabelText("delete budget"));
    await userEvent.click(
      screen.getByRole("button", { name: "confirm budget deletion" })
    );

    expect(onRemove).toBeCalledWith("035c2de4-00a4-403c-8f0e-f81339be9a4e");
  });

  it("triggers onSelect when user selects budget", async () => {
    await userEvent.type(
      screen.getByPlaceholderText("Search list of budgets..."),
      "2023-05"
    );
    await userEvent.click(screen.getByText("2023-05"));

    expect(onSelect).toBeCalledWith([
      {
        id: "036c2de4-00a4-402c-8f0e-f81339be9a4e",
        name: "2023-05",
      },
    ]);
  });

  it("triggers onSetCurrency when currency is selected from dropdown", async () => {
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
    await userEvent.type(screen.getByPlaceholderText("USD"), "CAD");
    await userEvent.click(screen.getByText("CAD"));
    expect(onSetCurrency).toBeCalledWith("CAD");
  });

  it("opens instructions in new tab", async () => {
    const instructionsButton = screen.getByLabelText(
      "open instructions in new tab"
    );
    await userEvent.click(instructionsButton);
    expect(instructionsButton).toHaveAttribute(
      "href",
      "https://github.com/rare-magma/guitos#getting-started"
    );
  });

  it("opens guitos repo in new tab", async () => {
    render(
      <NavBar
        budgetNameList={[]}
        currency={testIntlConfig.currency}
        selected={null}
        id={"035c2de4-00a4-403c-8f0e-f81339be9a4e"}
        onClone={onClone}
        onExport={onExport}
        onGoBack={onGoBack}
        onGoHome={onGoHome}
        onGoForward={onGoForward}
        onImport={onImport}
        onNew={onNew}
        onRemove={onRemove}
        onRename={onRename}
        onSelect={onSelect}
        onSetCurrency={onSetCurrency}
      />
    );
    const guitosButton = screen.getByLabelText("open guitos repository");
    await userEvent.click(guitosButton);
    expect(guitosButton).toHaveAttribute(
      "href",
      "https://github.com/rare-magma/guitos"
    );
  });
});
