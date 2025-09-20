import { UserOptions } from "@guitos/domain/userOptions";
import { localForageOptionsRepository } from "@guitos/infrastructure/localForageOptionsRepository";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import type { IntlConfig } from "react-currency-input-field";

interface ConfigContextInterface {
  userOptions: UserOptions;
  intlConfig: IntlConfig;
  setUserOptions: (value: UserOptions) => void;
}

const optionsRepository = new localForageOptionsRepository();
const options = new UserOptions(
  optionsRepository.getDefaultCurrencyCode(),
  optionsRepository.getUserLang(),
);

const ConfigContext = createContext<ConfigContextInterface>({
  userOptions: options,
  intlConfig: UserOptions.toIntlConfig(options),
  setUserOptions: (value: UserOptions) => value,
});

function useConfig() {
  const { userOptions, setUserOptions, intlConfig } = useContext(ConfigContext);

  return { userOptions, setUserOptions, intlConfig };
}

function ConfigProvider({ children }: PropsWithChildren) {
  const [userOptions, setUserOptions] = useState<UserOptions>(options);
  const intlConfig = UserOptions.toIntlConfig(userOptions);
  return (
    <ConfigContext value={{ userOptions, setUserOptions, intlConfig }}>
      {children}
    </ConfigContext>
  );
}

export { ConfigProvider, useConfig };
