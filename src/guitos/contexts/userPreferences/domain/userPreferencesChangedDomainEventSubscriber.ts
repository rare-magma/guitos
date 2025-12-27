import { UserPreferencesChangedDomainEvent } from "@guitos/contexts/userPreferences/domain/userPreferencesChangedDomainEvent";
import type { DomainEventName } from "@shared/domain/eventBus/domainEventName";
import type { DomainEventSubscriber } from "@shared/domain/eventBus/domainEventSubscriber";

export class UserPreferencesChangedDomainEventSubscriber
  implements DomainEventSubscriber<UserPreferencesChangedDomainEvent>
{
  private expectation:
    | ((actual: UserPreferencesChangedDomainEvent) => void)
    | undefined = undefined;

  name(): string {
    return "execute-action-on-user-preferences-changed-event";
  }

  subscribedTo(): DomainEventName<UserPreferencesChangedDomainEvent>[] {
    return [UserPreferencesChangedDomainEvent];
  }

  on(actual: UserPreferencesChangedDomainEvent): Promise<void> {
    if (this.expectation) {
      this.expectation(actual);
    }
    return Promise.resolve();
  }

  setExpectation(
    fn: (actual: UserPreferencesChangedDomainEvent) => void,
  ): void {
    this.expectation = fn;
  }
}
