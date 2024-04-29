import { PropsWithChildren, createContext, useContext, useState } from "react";
import {
  CurrencyInputProps,
  IntlConfig,
} from "react-currency-input-field/dist/components/CurrencyInputProps";
import { optionsDB } from "../db";
import { initialCurrencyCode, userLang } from "../utils";

interface ConfigContextInterface {
  intlConfig: IntlConfig | undefined;
  setIntlConfig: (value: IntlConfig) => void;
  currency: string;
  setCurrency: (value: string) => void;
}

const ConfigContext = createContext<ConfigContextInterface>({
  intlConfig: { locale: userLang, currency: initialCurrencyCode },
  setIntlConfig: (value: IntlConfig) => value,
  currency: initialCurrencyCode,
  setCurrency: (value: string) => value,
});

function useConfig() {
  const { currency, setCurrency, intlConfig, setIntlConfig } =
    useContext(ConfigContext);

  function handleCurrency(c: string) {
    optionsDB.setItem("currencyCode", c).catch((e) => {
      throw new Error(e as string);
    });
    setCurrency(c);
    setIntlConfig({ locale: userLang, currency: c });
  }

  return { intlConfig, setIntlConfig, currency, handleCurrency };
}

function ConfigProvider({ children }: PropsWithChildren) {
  const [currency, setCurrency] = useState<string>(initialCurrencyCode);
  const [intlConfig, setIntlConfig] = useState<
    CurrencyInputProps["intlConfig"]
  >({
    locale: userLang,
    currency: currency,
  });

  return (
    <ConfigContext.Provider
      value={{ intlConfig, setIntlConfig, currency, setCurrency }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { ConfigProvider, useConfig };
