import { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
import { DomainEvent } from "@shared/domain/eventBus/domainEvent";
import type { Primitives } from "@shared/domain/primitives";

type ChangeUserPreferencesDomainEventBody = Readonly<
  Primitives<UserPreferences>
>;

export class UserPreferencesChangedDomainEvent extends DomainEvent {
  static readonly eventName = "guitos.guitos.event.user-preferences.changed.1";

  readonly body: ChangeUserPreferencesDomainEventBody;

  constructor(
    args: Primitives<UserPreferences> & {
      eventId?: string;
      occurredOn?: Date;
    },
  ) {
    const { eventId, occurredOn, ...body } = args;

    super(
      UserPreferencesChangedDomainEvent.eventName,
      UserPreferences.name,
      eventId,
      occurredOn,
    );

    this.body = body;
  }

  toPrimitives(): ChangeUserPreferencesDomainEventBody {
    return this.body;
  }

  static fromPrimitives(
    body: ChangeUserPreferencesDomainEventBody,
    eventId: string,
    occurredOn: Date,
  ): DomainEvent {
    return new UserPreferencesChangedDomainEvent({
      ...body,
      eventId,
      occurredOn,
    });
  }
}
