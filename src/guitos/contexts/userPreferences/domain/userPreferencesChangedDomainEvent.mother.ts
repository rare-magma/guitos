import type { UserPreferences } from "@guitos/contexts/userPreferences/domain/userPreferences";
import { UserPreferencesChangedDomainEvent } from "@guitos/contexts/userPreferences/domain/userPreferencesChangedDomainEvent";
import type { Primitives } from "@shared/domain/primitives";

export class UserPreferencesChangedDomainEventMother {
  static create(
    params: Primitives<UserPreferences> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    return new UserPreferencesChangedDomainEvent(params);
  }

  static fromUserPreferences(
    aggregate: UserPreferences,
  ): UserPreferencesChangedDomainEvent {
    return UserPreferencesChangedDomainEventMother.create(
      aggregate.toPrimitives(),
    );
  }
}
