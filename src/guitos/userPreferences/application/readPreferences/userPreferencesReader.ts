import type { UserPreferencesQuery } from "@guitos/userPreferences/application/readPreferences/userPreferencesQuery";
import { UserPreferencesResponse } from "@guitos/userPreferences/application/readPreferences/userPreferencesResponse";
import { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
import type { UserPreferencesRepository } from "@guitos/userPreferences/domain/userPreferencesRepository";
import type { Clock } from "@shared/domain/clock";
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
    const preferences = await this.repository.read();

    if (!preferences) {
      const preferences = UserPreferences.create("USD", "en", this.clock.now());
      await this.eventBus.publish(preferences.pullDomainEvents());
      return new UserPreferencesResponse({
        currency: preferences.currency.value,
        locale: preferences.locale.value,
      });
    }

    return new UserPreferencesResponse({
      currency: preferences.currency.value,
      locale: preferences.locale.value,
    });
  }
}
