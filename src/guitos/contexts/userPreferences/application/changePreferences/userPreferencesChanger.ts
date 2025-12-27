import type { ChangeUserPreferencesCommand } from "@guitos/contexts/userPreferences/application/changePreferences/changeUserPreferencesCommand";
import { UserPreferences } from "@guitos/contexts/userPreferences/domain/userPreferences";
import type { UserPreferencesRepository } from "@guitos/contexts/userPreferences/domain/userPreferencesRepository";
import type { Clock } from "@shared/domain/clock";
import type { EventBus } from "@shared/domain/eventBus/eventBus";

export class UserPreferencesChanger {
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

  async run({ currency, locale }: ChangeUserPreferencesCommand): Promise<void> {
    const userPreferences = UserPreferences.create(
      currency,
      locale,
      this.clock.now(),
    );

    await this.repository.save(userPreferences.toPrimitives());
    await this.eventBus.publish(userPreferences.pullDomainEvents());
  }
}
