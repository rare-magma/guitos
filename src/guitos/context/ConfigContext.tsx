import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { localForageOptionsRepository } from "../infrastructure/localForageOptionsRepository";
import { UserOptions } from "../domain/userOptions";
import type { IntlConfig } from "react-currency-input-field/dist/components/CurrencyInputProps";

interface ConfigContextInterface {
  userOptions: UserOptions;
  intlConfig: IntlConfig;
  setUserOptions: (value: UserOptions) => void;
}

const optionsRepository = new localForageOptionsRepository();

const ConfigContext = createContext<ConfigContextInterface>({
  userOptions: new UserOptions(
    optionsRepository.getDefaultCurrencyCode(),
    optionsRepository.getUserLang(),
  ),
  intlConfig: UserOptions.toIntlConfig(
    new UserOptions(
      optionsRepository.getDefaultCurrencyCode(),
      optionsRepository.getUserLang(),
    ),
  ),
  setUserOptions: (value: UserOptions) => value,
});

function useConfig() {
  const { userOptions, setUserOptions, intlConfig } = useContext(ConfigContext);

  return { userOptions, setUserOptions, intlConfig };
}

function ConfigProvider({ children }: PropsWithChildren) {
  const [userOptions, setUserOptions] = useState<UserOptions>(
    new UserOptions(
      optionsRepository.getDefaultCurrencyCode(),
      optionsRepository.getUserLang(),
    ),
  );
  const intlConfig = UserOptions.toIntlConfig(userOptions);
  return (
    <ConfigContext.Provider value={{ userOptions, setUserOptions, intlConfig }}>
      {children}
    </ConfigContext.Provider>
  );
}

export { ConfigProvider, useConfig };
