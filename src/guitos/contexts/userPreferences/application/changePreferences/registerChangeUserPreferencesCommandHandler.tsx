import { ChangeUserPreferencesCommandHandler } from "@guitos/contexts/userPreferences/application/changePreferences/changeUserPreferencesCommandHandler";
import { UserPreferencesChanger } from "@guitos/contexts/userPreferences/application/changePreferences/userPreferencesChanger";
import { LocalForageUserPreferencesRepository } from "@guitos/contexts/userPreferences/infrastructure/localForageUserPreferencesRepository";
import { commandBus, eventBus } from "@guitos/infrastructure/buses";
import { CurrentTimeClock } from "@shared/infrastructure/currentTimeClock";

export function registerChangeUserPreferencesCommandHandler() {
  const changer = new UserPreferencesChanger(
    new CurrentTimeClock(),
    new LocalForageUserPreferencesRepository(),
    eventBus,
  );
  const commandHandler = new ChangeUserPreferencesCommandHandler(changer);

  commandBus.register(commandHandler);
}
