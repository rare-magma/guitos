import { useBusesContext } from "@guitos/context/BusesContext";
import { UserPreferencesQueryHandler } from "@guitos/userPreferences/application/readPreferences/userPreferencesQueryHandler";
import { UserPreferencesReader } from "@guitos/userPreferences/application/readPreferences/userPreferencesReader";
import { LocalForageUserPreferencesRepository } from "@guitos/userPreferences/infrastructure/localForageUserPreferencesRepository";
import { CurrentTimeClock } from "@shared/infrastructure/currentTimeClock";

export function useReadUserPreferencesQueryHandler() {
  const { queryBus, eventBus } = useBusesContext();

  const queryHandler = new UserPreferencesQueryHandler(
    new UserPreferencesReader(
      new CurrentTimeClock(),
      new LocalForageUserPreferencesRepository(),
      eventBus,
    ),
  );

  queryBus.register(queryHandler);
}
