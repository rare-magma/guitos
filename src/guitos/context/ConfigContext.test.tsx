import { ConfigProvider, useConfig } from "@guitos/context/ConfigContext";
import { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function TestComponent() {
  const { userOptions, setUserOptions, intlConfig } = useConfig();
  return (
    <>
      <p data-testid="currency">{userOptions.currencyCode}</p>
      <p data-testid="locale">{intlConfig.locale}</p>
      <button
        type="button"
        onClick={() => setUserOptions(new UserPreferences("EUR", "en"))}
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
    expect(screen.getByTestId("currency").textContent).toBe("EUR");
  });
});
