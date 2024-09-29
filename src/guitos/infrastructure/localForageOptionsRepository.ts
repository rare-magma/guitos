import localforage from "localforage";
import { currenciesMap } from "../../lists/currenciesMap";
import { CURRENCY_CODE, LOCALE } from "../domain/options";
import type { OptionsRepository } from "../domain/optionsRepository";

export class localForageOptionsRepository implements OptionsRepository {
  private readonly optionsDB;

  constructor() {
    this.optionsDB = localforage.createInstance({
      name: "guitos",
      storeName: "options",
    });
  }

  async getCurrencyCode(): Promise<string> {
    try {
      const code = await this.optionsDB.getItem<string>(CURRENCY_CODE);
      if (!code) {
        return this.getDefaultCurrencyCode();
      }
      return code;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  async saveCurrencyCode(newCode: string): Promise<boolean> {
    try {
      await this.optionsDB.setItem<string>(CURRENCY_CODE, newCode);
      return true;
    } catch {
      return false;
    }
  }

  async getLocale(): Promise<string> {
    try {
      const locale = await this.optionsDB.getItem<string>(LOCALE);
      if (!locale) throw new Error();
      return locale;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  async saveLocale(newLocale: string): Promise<boolean> {
    try {
      await this.optionsDB.setItem<string>(LOCALE, newLocale);
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
