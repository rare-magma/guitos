import type { UserPreferencesQuery } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesQuery";
import { UserPreferencesResponse } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesResponse";
import { Currency } from "@guitos/contexts/userPreferences/domain/currency";
import { Locale } from "@guitos/contexts/userPreferences/domain/locale";
import { UserPreferences } from "@guitos/contexts/userPreferences/domain/userPreferences";
import type { UserPreferencesRepository } from "@guitos/contexts/userPreferences/domain/userPreferencesRepository";
import type { Clock } from "@shared/domain/clock";
import { Datetime } from "@shared/domain/datetime";
import type { EventBus } from "@shared/domain/eventBus/eventBus";

export class UserPreferencesReader {
  private readonly clock: Clock;
  private readonly repository: UserPreferencesRepository;
  private readonly eventBus: EventBus;

  constructor(
    clock: Clock,
    repository: UserPreferencesRepository,
    eventBus: EventBus,
  ) {
    this.clock = clock;
    this.repository = repository;
    this.eventBus = eventBus;
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

    await this.eventBus.publish(preferences.pullDomainEvents());

    return new UserPreferencesResponse(preferences.toPrimitives());
  }
}
