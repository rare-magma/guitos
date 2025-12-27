import {
  ConfigProvider,
  useConfig,
} from "@guitos/application/react/context/ConfigContext";
import { ChangeUserPreferencesCommand } from "@guitos/contexts/userPreferences/application/changePreferences/changeUserPreferencesCommand";
import { commandBus } from "@guitos/infrastructure/buses";
import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function TestComponent() {
  const { userOptions, intlConfig } = useConfig();
  return (
    <>
      <p data-testid="currency">{userOptions?.currency.value}</p>
      <p data-testid="locale">{intlConfig?.locale}</p>
      <button
        type="button"
        onClick={() =>
          commandBus.dispatch(
            new ChangeUserPreferencesCommand({
              currency: "EUR",
              locale: "en",
            }),
          )
        }
      >
        Change Currency
      </button>
    </>
  );
}

describe("ConfigContext", () => {
  it("provides default config values", () => {
    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>,
    );
    expect(screen.getByTestId("currency").textContent).toBeDefined();
    expect(screen.getByTestId("locale").textContent).toBeDefined();
  });

  it("allows updating userOptions", () => {
    render(
      <ConfigProvider>
        <TestComponent />
      </ConfigProvider>,
    );
    act(() => {
      screen.getByText("Change Currency").click();
    });
    waitFor(() =>
      expect(screen.getByTestId("currency").textContent).toBe("EUR"),
    );
  });
});
