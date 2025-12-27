import type { UserPreferences } from "@guitos/contexts/userPreferences/domain/userPreferences";
import type { UserPreferencesRepository } from "@guitos/contexts/userPreferences/domain/userPreferencesRepository";
import type { Nullable } from "@shared/domain/nullable";
import type { Primitives } from "@shared/domain/primitives";
import localforage from "localforage";

export class LocalForageUserPreferencesRepository
  implements UserPreferencesRepository
{
  private readonly userPreferencesDB;
  private static readonly userPreferencesKey = "userPreferences";

  constructor() {
    this.userPreferencesDB = localforage.createInstance({
      name: "guitos",
      storeName: "userPreferences",
    });
  }

  async read(): Promise<Nullable<Primitives<UserPreferences>>> {
    try {
      const userPreferences = await this.userPreferencesDB.getItem<
        Primitives<UserPreferences>
      >(LocalForageUserPreferencesRepository.userPreferencesKey);

      if (!userPreferences) {
        return null;
      }

      return userPreferences;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  async save(userPreferences: Primitives<UserPreferences>): Promise<void> {
    try {
      await this.userPreferencesDB.setItem<Primitives<UserPreferences>>(
        LocalForageUserPreferencesRepository.userPreferencesKey,
        userPreferences,
      );
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }
}
