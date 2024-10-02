import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { CsvError } from "../../domain/csvError";
import { CsvErrorMother } from "../../domain/csvError.mother";
import type { JsonError } from "../../domain/jsonError";
import { JsonErrorMother } from "../../domain/jsonError.mother";
import { ErrorModal } from "./ErrorModal";

const error = "Thrown error";
const jsonErrors: JsonError[] = [JsonErrorMother.error()];

const csvErrors: CsvError[] = [CsvErrorMother.error()];

const setShowError = vi.fn();
const setShowCsvErrors = vi.fn();
const setShowJsonErrors = vi.fn();
const handleDismiss = vi.fn();

describe("ErrorModal", () => {
  const comp = (
    <ErrorModal
      error={error}
      setShowError={setShowError}
      showError={true}
      jsonErrors={jsonErrors}
      setJsonErrors={setShowJsonErrors}
      csvErrors={csvErrors}
      setCsvErrors={setShowCsvErrors}
      handleDismiss={handleDismiss}
    />
  );

  it("matches snapshot", () => {
    render(comp);
    expect(comp).toMatchSnapshot();
  });

  it("renders initial state", () => {
    render(comp);
    expect(
      screen.getAllByText("Errors found while importing:")[0],
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "SyntaxError: Expected ',' or '}' after property value in JSON at position 209",
      ),
    ).toBeInTheDocument();
  });

  it("closes error when clicking the button", async () => {
    render(comp);
    expect(screen.getByTestId("error-modal")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("error-modal-dismiss"));
  });

  it("closes json error when clicking the button", async () => {
    render(comp);
    expect(screen.getByTestId("json-error-close")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("json-error-close"));
  });

  it("closes json error modal when clicking the button", async () => {
    render(comp);
    expect(screen.getByTestId("json-error-modal")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("json-error-modal"));
  });

  it("closes csv error when clicking the button", async () => {
    render(comp);

    expect(screen.getByTestId("csv-error-close")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("csv-error-close"));
  });

  it("closes csv error modal when clicking the button", async () => {
    render(comp);

    expect(screen.getByTestId("csv-error-modal")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("csv-error-modal"));
  });
});
