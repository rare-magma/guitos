import { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
import type { UserPreferencesRepository } from "@guitos/userPreferences/domain/userPreferencesRepository";
import { Datetime } from "@shared/domain/datetime";
import localforage from "localforage";
import { currenciesMap } from "../../../lists/currenciesMap";

export class localForageUserPreferencesRepository
  implements UserPreferencesRepository
{
  private readonly optionsDB;
  private static readonly currencyKey = "currencyCode";
  private static readonly localeKey = "locale";

  constructor() {
    this.optionsDB = localforage.createInstance({
      name: "guitos",
      storeName: "options",
    });
  }

  async read(): Promise<UserPreferences> {
    try {
      let code = await this.optionsDB.getItem<string>(
        localForageUserPreferencesRepository.currencyKey,
      );
      if (!code) {
        code = this.getDefaultCurrencyCode();
      }

      let locale = await this.optionsDB.getItem<string>(
        localForageUserPreferencesRepository.localeKey,
      );
      if (!locale) {
        locale = this.getUserLang();
      }

      return UserPreferences.create(code, locale, new Datetime());
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  async save(userPreferences: UserPreferences): Promise<void> {
    try {
      await this.optionsDB.setItem<string>(
        localForageUserPreferencesRepository.currencyKey,
        userPreferences.currency.value,
      );
      await this.optionsDB.setItem<string>(
        localForageUserPreferencesRepository.localeKey,
        userPreferences.locale.value,
      );
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  async getCurrencyCode(): Promise<string> {
    try {
      const code = await this.optionsDB.getItem<string>(
        localForageUserPreferencesRepository.currencyKey,
      );
      if (!code) {
        return this.getDefaultCurrencyCode();
      }
      return code;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  async saveCurrencyCode(options: UserPreferences): Promise<boolean> {
    try {
      await this.optionsDB.setItem<string>(
        localForageUserPreferencesRepository.currencyKey,
        options.currency.value,
      );
      return true;
    } catch {
      return false;
    }
  }

  async getLocale(): Promise<string> {
    try {
      const locale = await this.optionsDB.getItem<string>(
        localForageUserPreferencesRepository.localeKey,
      );
      if (!locale) throw new Error();
      return locale;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  async saveLocale(options: UserPreferences): Promise<boolean> {
    try {
      await this.optionsDB.setItem<string>(
        localForageUserPreferencesRepository.localeKey,
        options.locale.value,
      );
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
