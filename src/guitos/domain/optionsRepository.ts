export interface OptionsRepository {
  getCurrencyCode(): Promise<string>;
  saveCurrencyCode(newCode: string): Promise<boolean>;
  getLocale(): Promise<string>;
  saveLocale(newLocale: string): Promise<boolean>;
  getUserLang(): string;
  getCountryCode(locale: string): string;
  getDefaultCurrencyCode(): string;
}
