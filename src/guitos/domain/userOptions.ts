import type { IntlConfig } from "react-currency-input-field/dist/components/CurrencyInputProps";
import { currenciesList } from "../../lists/currenciesList";

export const CURRENCY_CODE = "currencyCode";
export const LOCALE = "locale";

export class UserOptions {
  currencyCode: string;
  locale: string;

  constructor(currencyCode: string, locale: string) {
    this.currencyCode = currencyCode;
    this.locale = locale;

    this.ensureIsValidCode(currencyCode);
  }

  private ensureIsValidCode(code: string): void {
    if (!currenciesList.includes(code)) {
      throw new Error(
        `<${this.constructor.name}> does not allow the currency code <${code}>`,
      );
    }
  }

  static toIntlConfig(userOptions: UserOptions): IntlConfig {
    return {
      locale: userOptions.locale,
      currency: userOptions.currencyCode,
    };
  }
}
