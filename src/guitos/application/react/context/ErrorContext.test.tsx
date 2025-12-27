import {
  ErrorProvider,
  useErrorContext,
} from "@guitos/application/react/context/ErrorContext";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function TestErrorComponent() {
  const { error, setError, showError, handleError } = useErrorContext();

  return (
    <>
      <button type="button" onClick={() => setError("Test error")}>
        Set Error
      </button>
      <button
        type="button"
        onClick={() => handleError(new Error("Thrown error"))}
      >
        Handle Error
      </button>
      <p data-testid="error">{error}</p>
      <p data-testid="visible">{showError.toString()}</p>
    </>
  );
}

describe("ErrorContext", () => {
  it("sets and displays error messages", () => {
    render(
      <ErrorProvider>
        <TestErrorComponent />
      </ErrorProvider>,
    );
    act(() => {
      screen.getByText("Set Error").click();
    });
    expect(screen.getByTestId("error").textContent).toBe("Test error");
  });

  it("handles thrown errors", () => {
    render(
      <ErrorProvider>
        <TestErrorComponent />
      </ErrorProvider>,
    );
    act(() => {
      screen.getByText("Handle Error").click();
    });
    expect(screen.getByTestId("error").textContent).toBe("Thrown error");
    expect(screen.getByTestId("visible").textContent).toBe("true");
  });
});
