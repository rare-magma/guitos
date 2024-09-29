import type { UserOptions } from "./userOptions";

export interface UserOptionsRepository {
  getCurrencyCode(): Promise<string>;
  saveCurrencyCode(options: UserOptions): Promise<boolean>;
  getLocale(): Promise<string>;
  saveLocale(Options: UserOptions): Promise<boolean>;
  getUserLang(): string;
  getCountryCode(locale: string): string;
  getDefaultCurrencyCode(): string;
}
