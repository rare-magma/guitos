import { useReactToEvents } from "@guitos/application/react/hooks/useReactToEvents";
import { UserPreferencesQuery } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesQuery";
import type { UserPreferencesResponse } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesResponse";
import { Currency } from "@guitos/contexts/userPreferences/domain/currency";
import { Locale } from "@guitos/contexts/userPreferences/domain/locale";
import { UserPreferences } from "@guitos/contexts/userPreferences/domain/userPreferences";
import { UserPreferencesChangedDomainEvent } from "@guitos/contexts/userPreferences/domain/userPreferencesChangedDomainEvent";
import { Datetime } from "@shared/domain/datetime";
import type { QueryBus } from "@shared/domain/queryBus/queryBus";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import type { IntlConfig } from "react-currency-input-field";

interface ConfigContextInterface {
  userOptions: UserPreferences | undefined;
  intlConfig: IntlConfig | undefined;
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

function ConfigProvider({
  queryBus,
  children,
}: PropsWithChildren<{ queryBus: QueryBus }>) {
  const [userOptions, setUserOptions] = useState<UserPreferences>();
  const intlConfig: IntlConfig | undefined = userOptions
    ? {
        locale: userOptions?.locale.value,
        currency: userOptions?.currency.value,
      }
    : undefined;
  const userPreferencesChanged = useReactToEvents([
    UserPreferencesChangedDomainEvent.eventName,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: react to event
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

    readUserPreferences();
  }, [userPreferencesChanged]);

  return (
    <ConfigContext value={{ userOptions, intlConfig }}>
      {children}
    </ConfigContext>
  );
}

export { ConfigProvider, useConfig };
