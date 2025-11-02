import type { CsvError } from "@guitos/domain/csvError";
import { CsvErrorMother } from "@guitos/domain/csvError.mother";
import type { JsonError } from "@guitos/domain/jsonError";
import { JsonErrorMother } from "@guitos/domain/jsonError.mother";
import ErrorModal from "@guitos/sections/ErrorModal/ErrorModal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

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
