import type { UserPreferences } from "@guitos/contexts/userPreferences/domain/userPreferences";
import type { Nullable } from "@shared/domain/nullable";
import type { Primitives } from "@shared/domain/primitives";

export interface UserPreferencesRepository {
  read(): Promise<Nullable<Primitives<UserPreferences>>>;
  save(userPreferences: Primitives<UserPreferences>): Promise<void>;
}
