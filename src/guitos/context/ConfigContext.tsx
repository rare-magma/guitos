import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import type {
  CurrencyInputProps,
  IntlConfig,
} from "react-currency-input-field/dist/components/CurrencyInputProps";
import { localForageOptionsRepository } from "../infrastructure/localForageOptionsRepository";

interface ConfigContextInterface {
  intlConfig: IntlConfig | undefined;
  setIntlConfig: (value: IntlConfig) => void;
  currency: string;
  setCurrency: (value: string) => void;
}

const optionsRepository = new localForageOptionsRepository();

const ConfigContext = createContext<ConfigContextInterface>({
  intlConfig: {
    locale: optionsRepository.getUserLang(),
    currency: optionsRepository.getDefaultCurrencyCode(),
  },
  setIntlConfig: (value: IntlConfig) => value,
  currency: optionsRepository.getDefaultCurrencyCode(),
  setCurrency: (value: string) => value,
});

function useConfig() {
  const { currency, setCurrency, intlConfig, setIntlConfig } =
    useContext(ConfigContext);

  function handleCurrency(c: string) {
    setCurrency(c);
    setIntlConfig({ locale: optionsRepository.getUserLang(), currency: c });
  }

  return { intlConfig, setIntlConfig, currency, handleCurrency };
}

function ConfigProvider({ children }: PropsWithChildren) {
  const [currency, setCurrency] = useState<string>(
    optionsRepository.getDefaultCurrencyCode(),
  );
  const [intlConfig, setIntlConfig] = useState<
    CurrencyInputProps["intlConfig"]
  >({
    locale: optionsRepository.getUserLang(),
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

export { ConfigProvider, useConfig };
