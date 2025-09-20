import type { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
import type { Nullable } from "@shared/domain/nullable";

export interface UserPreferencesRepository {
  save(userPreferences: UserPreferences): Promise<void>;
  read(): Promise<Nullable<UserPreferences>>;
  getUserLang(): string;
  getCountryCode(locale: string): string;
  getDefaultCurrencyCode(): string;
}
