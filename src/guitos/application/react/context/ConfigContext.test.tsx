import {
  ConfigProvider,
  useConfig,
} from "@guitos/application/react/context/ConfigContext";
import { ChangeUserPreferencesCommand } from "@guitos/contexts/userPreferences/application/changePreferences/changeUserPreferencesCommand";
import { UserPreferencesQueryHandler } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesQueryHandler";
import { UserPreferencesReader } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesReader";
import { LocalForageUserPreferencesRepository } from "@guitos/contexts/userPreferences/infrastructure/localForageUserPreferencesRepository";
import { commandBus, queryBus } from "@shared/infrastructure/buses";
import { CurrentTimeClock } from "@shared/infrastructure/currentTimeClock";
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
  const queryHandler = new UserPreferencesQueryHandler(
    new UserPreferencesReader(
      new CurrentTimeClock(),
      new LocalForageUserPreferencesRepository(),
    ),
  );
  queryBus.register(queryHandler);

  it("provides default config values", () => {
    render(
      <ConfigProvider queryBus={queryBus}>
        <TestComponent />
      </ConfigProvider>,
    );
    expect(screen.getByTestId("currency").textContent).toBeDefined();
    expect(screen.getByTestId("locale").textContent).toBeDefined();
  });

  it("allows updating userOptions", () => {
    render(
      <ConfigProvider queryBus={queryBus}>
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
