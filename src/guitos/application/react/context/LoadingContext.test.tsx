import {
  LoadingProvider,
  useLoadingContext,
} from "@guitos/application/react/context/LoadingContext";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function TestLoadingComponent() {
  const { loadingFromDB, setLoadingFromDB, shouldReload, setShouldReload } =
    useLoadingContext();

  return (
    <>
      <p data-testid="loading">{loadingFromDB.toString()}</p>
      <p data-testid="should">{shouldReload.toString()}</p>
      <button type="button" onClick={() => setLoadingFromDB(false)}>
        Set Loading From DB
      </button>
      <button type="button" onClick={() => setShouldReload(false)}>
        Should Reload
      </button>
    </>
  );
}

describe("LoadingContext", () => {
  it("sets and displays loading from DB", () => {
    render(
      <LoadingProvider>
        <TestLoadingComponent />
      </LoadingProvider>,
    );
    act(() => {
      screen.getByText("Set Loading From DB").click();
    });
    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("sets and displays should reload", () => {
    render(
      <LoadingProvider>
        <TestLoadingComponent />
      </LoadingProvider>,
    );
    act(() => {
      screen.getByText("Should Reload").click();
    });
    expect(screen.getByTestId("should").textContent).toBe("false");
  });
});
