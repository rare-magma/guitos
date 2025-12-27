import { UserPreferencesResponse } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesResponse";
import { UserPreferencesMother } from "@guitos/contexts/userPreferences/domain/userPreferences.mother";
import type { Primitives } from "@shared/domain/primitives";

export class UserPreferencesResponseMother {
  static create(
    primitives: Primitives<UserPreferencesResponse>,
  ): UserPreferencesResponse {
    return new UserPreferencesResponse(primitives);
  }

  static random(
    overwrites?: Partial<Primitives<UserPreferencesResponse>>,
  ): UserPreferencesResponse {
    const userPrefs = UserPreferencesMother.random();
    return UserPreferencesResponseMother.create({
      ...userPrefs.toPrimitives(),
      ...overwrites,
    });
  }

  static default(): UserPreferencesResponse {
    const userPrefs = UserPreferencesMother.default();
    return UserPreferencesResponseMother.create({
      ...userPrefs.toPrimitives(),
    });
  }
}
