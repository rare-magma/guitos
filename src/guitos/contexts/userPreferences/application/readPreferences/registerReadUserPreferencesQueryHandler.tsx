import { UserPreferencesQueryHandler } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesQueryHandler";
import { UserPreferencesReader } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesReader";
import { LocalForageUserPreferencesRepository } from "@guitos/contexts/userPreferences/infrastructure/localForageUserPreferencesRepository";
import { queryBus } from "@shared/infrastructure/buses";
import { CurrentTimeClock } from "@shared/infrastructure/currentTimeClock";

export function registerReadUserPreferencesQueryHandler() {
  const queryHandler = new UserPreferencesQueryHandler(
    new UserPreferencesReader(
      new CurrentTimeClock(),
      new LocalForageUserPreferencesRepository(),
    ),
  );

  queryBus.register(queryHandler);
}
