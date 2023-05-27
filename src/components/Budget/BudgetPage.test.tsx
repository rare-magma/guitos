import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BudgetPage from "./BudgetPage";
import {
  testBudget,
  testCsv,
  testCsvError,
  testJSONErrorBudget,
} from "../../setupTests";

describe("BudgetPage", () => {
  beforeEach(async () => {
    render(<BudgetPage />);
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
  });

  it("renders initial state", () => {
    expect(screen.getByLabelText("delete budget")).toBeInTheDocument();
  });

  it.todo("removes budget when clicking on delete budget button", async () => {
    const deleteButton = screen.getAllByRole("button", {
      name: "delete budget",
    });
    await userEvent.click(deleteButton[0]);
    await userEvent.click(
      screen.getByRole("button", { name: "confirm budget deletion" })
    );
    expect(screen.queryByRole("button", { name: "delete budget" })).toBeNull();
  });

  it("clones budget when clicking on clone budget button", async () => {
    const cloneButton = screen.getAllByRole("button", {
      name: "clone budget",
    });
    await userEvent.click(cloneButton[0]);
    expect(screen.getByText("2023-035c2de4-clone")).toBeInTheDocument();
  });

  it.todo("responds to save budget keyboard shortcut", async () => {
    // await userEvent.type(screen.getByTestId("header"), "s");
  });

  it.todo("responds to new budget keyboard shortcut", async () => {
    await userEvent.type(screen.getByTestId("header"), "a");
  });

  it.todo("responds to clone budget keyboard shortcut", async () => {
    await userEvent.type(screen.getByTestId("header"), "c");
    expect(screen.getByText("2023-035c2de4-clone-clone")).toBeInTheDocument();
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
  });

  it.todo("doesn't save faulty json to db", async () => {
    await userEvent.upload(
      screen.getByTestId("import-form-control"),
      new Blob([JSON.stringify(testJSONErrorBudget)]) as File
    );
  });

  it.todo("saves imported csv to db", async () => {
    await userEvent.upload(
      screen.getByTestId("import-form-control"),
      new File([testCsv], "test.csv", { type: "text/csv" })
    );
  });

  it.todo("doesn't save faulty csv to db", async () => {
    await userEvent.upload(
      screen.getByTestId("import-form-control"),
      new File([testCsvError], "test.csv", { type: "text/csv" })
    );
  });
});
