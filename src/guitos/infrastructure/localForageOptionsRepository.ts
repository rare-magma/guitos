import { CURRENCY_CODE, LOCALE } from "../domain/options";
import { OptionsRepository } from "../domain/optionsRepository";
import { optionsDB } from "./localForageDb";

export class localForageOptionsRepository implements OptionsRepository {
  async getCurrencyCode(): Promise<string> {
    try {
      const code = await optionsDB.getItem<string>(CURRENCY_CODE);
      if (!code) throw new Error();
      return code;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async saveCurrencyCode(newCode: string): Promise<boolean> {
    try {
      await optionsDB.setItem<string>(CURRENCY_CODE, newCode);
      return true;
    } catch {
      return false;
    }
  }

  async getLocale(): Promise<string> {
    try {
      const locale = await optionsDB.getItem<string>(LOCALE);
      if (!locale) throw new Error();
      return locale;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async saveLocale(newLocale: string): Promise<boolean> {
    try {
      await optionsDB.setItem<string>(LOCALE, newLocale);
      return true;
    } catch {
      return false;
    }
  }
}
