import { useBusesContext } from "@guitos/context/BusesContext";
import { UserPreferencesQuery } from "@guitos/userPreferences/application/changePreferences/userPreferencesQuery";
import type { UserPreferencesResponse } from "@guitos/userPreferences/application/changePreferences/userPreferencesResponse";
import type { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
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
  const [userOptions, setUserOptions] = useState<UserPreferences>();
  const intlConfig: IntlConfig = {
    locale: userOptions?.locale.value,
    currency: userOptions?.currency.value,
  };

  useEffect(() => {
    async function readUserPreferences() {
      const userPreferences = await queryBus.ask<UserPreferencesResponse>(
        new UserPreferencesQuery(),
      );
      setUserOptions(userPreferences);
      return userPreferences;
    }
    readUserPreferences();
  }, [queryBus]);
  return (
    <ConfigContext value={{ userOptions, intlConfig }}>
      {children}
    </ConfigContext>
  );
}

export { ConfigProvider, useConfig };
