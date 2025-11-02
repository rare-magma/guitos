import { useBusesContext } from "@guitos/context/BusesContext";
import { ChangeUserPreferencesCommandHandler } from "@guitos/userPreferences/application/changePreferences/changeUserPreferencesCommandHandler";
import { UserPreferencesChanger } from "@guitos/userPreferences/application/changePreferences/userPreferencesChanger";
import { UserPreferencesChangedDomainEventSubscriber } from "@guitos/userPreferences/domain/userPreferencesChangedDomainEventSubscriber";
import { LocalForageUserPreferencesRepository } from "@guitos/userPreferences/infrastructure/localForageUserPreferencesRepository";
import { CurrentTimeClock } from "@shared/infrastructure/currentTimeClock";

export function useChangeUserPreferencesCommandHandler() {
  const { commandBus, eventBus } = useBusesContext();

  const changer = new UserPreferencesChanger(
    new CurrentTimeClock(),
    new LocalForageUserPreferencesRepository(),
    eventBus,
  );
  const commandHandler = new ChangeUserPreferencesCommandHandler(changer);

  commandBus.register(commandHandler);
  eventBus.subscribe(new UserPreferencesChangedDomainEventSubscriber(changer));
}
