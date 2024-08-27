import { currenciesList } from "../../lists/currenciesList";

export const CURRENCY_CODE = "currencyCode";
export const LOCALE = "locale";
export default class Options {
  currencyCode: string;
  locale: NavigatorLanguage;

  constructor(currencyCode: string, locale: NavigatorLanguage) {
    this.currencyCode = currencyCode;
    this.locale = locale;

    this.ensureIsValidCode(currencyCode);
    this.ensureIsValidLocale(locale);
  }

  private ensureIsValidCode(code: string): void {
    if (!currenciesList.includes(code)) {
      throw new Error(
        `<${this.constructor.name}> does not allow the value <${code}>`,
      );
    }
  }

  private ensureIsValidLocale(locale: NavigatorLanguage): void {
    if (!locale.language.includes(locale.language)) {
      throw new Error(
        `<${this.constructor.name}> does not allow the value <${locale}>`,
      );
    }
  }
}
