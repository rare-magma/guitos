import { useBusesContext } from "@guitos/context/BusesContext";
import { useReactToEvents } from "@guitos/hooks/useEventBus";
import { UserPreferencesQuery } from "@guitos/userPreferences/application/readPreferences/userPreferencesQuery";
import type { UserPreferencesResponse } from "@guitos/userPreferences/application/readPreferences/userPreferencesResponse";
import { Currency } from "@guitos/userPreferences/domain/currency";
import { Locale } from "@guitos/userPreferences/domain/locale";
import { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
import { UserPreferencesChangedDomainEvent } from "@guitos/userPreferences/domain/userPreferencesChangedDomainEvent";
import { Datetime } from "@shared/domain/datetime";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import type { IntlConfig } from "react-currency-input-field";

interface ConfigContextInterface {
  userOptions: UserPreferences;
  intlConfig: IntlConfig;
}

const ConfigContext = createContext<ConfigContextInterface | undefined>(
  undefined,
);

function useConfig() {
  const context = useContext(ConfigContext);

  if (!context) {
    throw new Error("useConfigContext must be used within a ConfigProvider");
  }
  return context;
}

function ConfigProvider({ children }: PropsWithChildren) {
  const { queryBus } = useBusesContext();
  const [userOptions, setUserOptions] = useState<UserPreferences>(
    new UserPreferences(
      new Currency("USD"),
      new Locale("en-US"),
      new Datetime(),
    ),
  );
  const intlConfig: IntlConfig = {
    locale: userOptions?.locale.value,
    currency: userOptions?.currency.value,
  };
  const userPreferencesChanged = useReactToEvents([
    UserPreferencesChangedDomainEvent.eventName,
  ]);

  useEffect(() => {
    async function readUserPreferences() {
      const { currency, locale } = await queryBus.ask<UserPreferencesResponse>(
        new UserPreferencesQuery(),
      );
      setUserOptions(
        new UserPreferences(
          new Currency(currency),
          new Locale(locale),
          new Datetime(),
        ),
      );
    }
    if (userPreferencesChanged) {
      readUserPreferences();
    }
  }, [userPreferencesChanged, queryBus]);

  return (
    <ConfigContext value={{ userOptions, intlConfig }}>
      {children}
    </ConfigContext>
  );
}

export { ConfigProvider, useConfig };
