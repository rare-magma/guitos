import type { UserPreferencesQuery } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesQuery";
import { UserPreferencesResponse } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesResponse";
import { Currency } from "@guitos/contexts/userPreferences/domain/currency";
import { Locale } from "@guitos/contexts/userPreferences/domain/locale";
import { UserPreferences } from "@guitos/contexts/userPreferences/domain/userPreferences";
import type { UserPreferencesRepository } from "@guitos/contexts/userPreferences/domain/userPreferencesRepository";
import type { Clock } from "@shared/domain/clock";
import { Datetime } from "@shared/domain/datetime";

export class UserPreferencesReader {
  private readonly clock: Clock;
  private readonly repository: UserPreferencesRepository;

  constructor(clock: Clock, repository: UserPreferencesRepository) {
    this.clock = clock;
    this.repository = repository;
  }

  async run(_query: UserPreferencesQuery): Promise<UserPreferencesResponse> {
    const savedPreferences = await this.repository.read();

    const preferences = savedPreferences
      ? new UserPreferences(
          new Currency(savedPreferences.currency),
          new Locale(savedPreferences.locale),
          new Datetime(savedPreferences.createdAt),
        )
      : UserPreferences.default(this.clock.now());

    return new UserPreferencesResponse(preferences.toPrimitives());
  }
}
