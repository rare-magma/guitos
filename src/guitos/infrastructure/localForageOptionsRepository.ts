import { UserOptions } from "@guitos/domain/userOptions";
import type { UserOptionsRepository } from "@guitos/domain/userOptionsRepository";
import localforage from "localforage";
import { currenciesMap } from "../../lists/currenciesMap";

export class localForageOptionsRepository implements UserOptionsRepository {
  private readonly optionsDB;

  constructor() {
    this.optionsDB = localforage.createInstance({
      name: "guitos",
      storeName: "options",
    });
  }

  async getCurrencyCode(): Promise<string> {
    try {
      const code = await this.optionsDB.getItem<string>(
        UserOptions.CURRENCY_CODE,
      );
      if (!code) {
        return this.getDefaultCurrencyCode();
      }
      return code;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  async saveCurrencyCode(options: UserOptions): Promise<boolean> {
    try {
      await this.optionsDB.setItem<string>(
        UserOptions.CURRENCY_CODE,
        options.currencyCode,
      );
      return true;
    } catch {
      return false;
    }
  }

  async getLocale(): Promise<string> {
    try {
      const locale = await this.optionsDB.getItem<string>(UserOptions.LOCALE);
      if (!locale) throw new Error();
      return locale;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  async saveLocale(options: UserOptions): Promise<boolean> {
    try {
      await this.optionsDB.setItem<string>(UserOptions.LOCALE, options.locale);
      return true;
    } catch {
      return false;
    }
  }

  getUserLang(): string {
    return navigator.language;
  }

  getCountryCode(locale: string): string {
    return locale.split("-").length >= 2
      ? locale.split("-")[1].toUpperCase()
      : locale.toUpperCase();
  }

  getDefaultCurrencyCode(): string {
    const country = this.getCountryCode(this.getUserLang());
    return this.getCurrencyCodeFromCountry(country);
  }

  getCurrencyCodeFromCountry(country: string): string {
    const countryIsInMap =
      currenciesMap[country as keyof typeof currenciesMap] !== undefined;

    if (countryIsInMap) {
      return currenciesMap[
        country as keyof typeof currenciesMap
      ] as unknown as string;
    }
    return "USD";
  }
}
