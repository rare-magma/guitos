import "fake-indexeddb/auto";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BudgetPage from "./BudgetPage";
import { budgetsDB, optionsDB } from "../../App";
import {
  testBudget,
  testCsv,
  testCsvError,
  testJSONErrorBudget,
} from "../../setupTests";
import { Budget } from "./Budget";

describe("BudgetPage", () => {
  beforeEach(async () => {
    render(<BudgetPage />);
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
  });

  it("renders initial state", () => {
    expect(screen.getByLabelText("delete budget")).toBeInTheDocument();
    expect(budgetsDB.config("name")).toBe("guitos");
    expect(budgetsDB.config("storeName")).toBe("budgets");
  });

  it("sets up db correctly", () => {
    expect(budgetsDB.config("name")).toBe("guitos");
    expect(budgetsDB.config("storeName")).toBe("budgets");
    expect(optionsDB.config("name")).toBe("guitos");
    expect(optionsDB.config("storeName")).toBe("options");
  });

  it("saves currency code to db", async () => {
    await expect(budgetsDB.keys()).resolves.not.toBeNull();

    await act(async () => {
      await userEvent.type(screen.getByPlaceholderText("USD"), "CAD");
      await userEvent.click(screen.getByText("CAD"));
    });
    const currencyOption = await optionsDB.getItem("currencyCode");
    expect(currencyOption).toBe("CAD");
  });

  it.todo(
    "removes budget from db when clicking on delete budget button",
    async () => {
      await expect(budgetsDB.length()).resolves.toBe(1);
      const deleteButton = screen.getAllByRole("button", {
        name: "delete budget",
      });
      await userEvent.click(deleteButton[0]);
      await userEvent.click(
        screen.getByRole("button", { name: "confirm budget deletion" })
      );
      await expect(budgetsDB.length()).resolves.toBe(0);
    }
  );

  it.todo("responds to save budget keyboard shortcut", async () => {
    // await userEvent.type(screen.getByTestId("header"), "s");
  });

  it.todo("responds to new budget keyboard shortcut", async () => {
    await userEvent.type(screen.getByTestId("header"), "a");
  });

  it.todo("responds to clone budget keyboard shortcut", async () => {
    await userEvent.type(screen.getByTestId("header"), "c");
  });

  it.todo("responds to go back keyboard shortcut", async () => {
    await userEvent.type(screen.getByTestId("header"), "{pagedown}");
  });

  it.todo("responds to go forward keyboard shortcut", async () => {
    await userEvent.type(screen.getByTestId("header"), "{pageup}");
  });

  it.todo("saves imported json to db", async () => {
    await userEvent.upload(
      screen.getByTestId("import-form-control"),
      new Blob([JSON.stringify(testBudget)]) as File
    );

    await expect(budgetsDB.length()).resolves.toBe(1);
    await budgetsDB
      .getItem("035c2de4-00a4-403c-8f0e-f81339be9a4e")
      .then((e) => {
        expect((e as Budget).name).toBe("2023-035c2de4");
        expect(JSON.stringify(e)).toBe(
          '{"id":"035c2de4-00a4-403c-8f0e-f81339be9a4e","name":"2023-035c2de4","expenses":{"items":[{"id":1,"name":"","value":0}],"total":0},"incomes":{"items":[{"id":1,"name":"","value":0}],"total":0},"stats":{"available":0,"withGoal":0,"saved":0,"goal":10,"reserves":0}}'
        );
      });
    await budgetsDB.clear();
  });

  it.todo("doesn't save faulty json to db", async () => {
    await budgetsDB.clear();
    await expect(budgetsDB.length()).resolves.toBe(0);
    await userEvent.upload(
      screen.getByTestId("import-form-control"),
      new Blob([JSON.stringify(testJSONErrorBudget)]) as File
    );

    await expect(budgetsDB.length()).resolves.toBe(0);
  });

  it.todo("saves imported csv to db", async () => {
    await budgetsDB.clear();
    await userEvent.upload(
      screen.getByTestId("import-form-control"),
      new File([testCsv], "test.csv", { type: "text/csv" })
    );
    await budgetsDB
      .getItem("035c2de4-00a4-403c-8f0e-f81339be9a4e")
      .then((e) => {
        expect((e as Budget).name).toBe("test");
        expect(JSON.stringify(e)).toBe(
          '{"id":"035c2de4-00a4-403c-8f0e-f81339be9a4e","name":"test","expenses":{"items":[{"name":"rent","value":1000},{"id":1,"name":"food","value":200}],"total":1200},"incomes":{"items":[{"id":2,"name":"salary","value":2000},{"id":3,"name":"sale","value":100}],"total":2100},"stats":{"available":900,"withGoal":690,"saved":210,"goal":10,"reserves":0}}'
        );
      });
    await budgetsDB.clear();
  });

  it.todo("doesn't save faulty csv to db", async () => {
    await budgetsDB.clear();
    await expect(budgetsDB.length()).resolves.toBe(0);
    await userEvent.upload(
      screen.getByTestId("import-form-control"),
      new File([testCsvError], "test.csv", { type: "text/csv" })
    );

    await expect(budgetsDB.length()).resolves.toBe(0);
  });
});
