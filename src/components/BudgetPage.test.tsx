import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BudgetPage from "./BudgetPage";
import { testCsvError, testJSONErrorBudget } from "../setupTests";

describe("BudgetPage", () => {
  beforeEach(() => {
    render(<BudgetPage />);
  });

  it("renders initial state", async () => {
    const newButton = screen.getAllByRole("button", { name: "new budget" });
    await userEvent.click(newButton[0]);
    expect(screen.getByLabelText("delete budget")).toBeInTheDocument();
  });

  it("triggers JSON error modal when malformed file is imported", async () => {
    const jsonBlob = new Blob([testJSONErrorBudget], {
      type: "application/json",
    });

    await userEvent.upload(
      screen.getByTestId("import-form-control"),
      jsonBlob as unknown as File
    );

    const jsonErrorModal = screen.getByTestId("json-error-modal");
    expect(jsonErrorModal).toBeInTheDocument();

    const closeButton = screen.getByTestId("json-error-close");
    await userEvent.click(closeButton);
    expect(jsonErrorModal).not.toBeInTheDocument();
  });

  it("triggers CSV error modal when malformed file is imported", async () => {
    const csvBlob = new Blob([testCsvError], {
      type: "text/csv",
    });

    await userEvent.upload(
      screen.getByTestId("import-form-control"),
      csvBlob as unknown as File
    );

    const csvErrorModal = screen.getByTestId("csv-error-modal");
    expect(csvErrorModal).toBeInTheDocument();

    const closeButton = screen.getByTestId("csv-error-close");
    await userEvent.click(closeButton);
    expect(csvErrorModal).not.toBeInTheDocument();
  });
});
