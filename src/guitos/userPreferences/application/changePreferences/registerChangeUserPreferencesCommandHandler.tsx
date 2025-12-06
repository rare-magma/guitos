import { commandBus, eventBus } from "@guitos/infrastructure/buses";
import { ChangeUserPreferencesCommandHandler } from "@guitos/userPreferences/application/changePreferences/changeUserPreferencesCommandHandler";
import { UserPreferencesChanger } from "@guitos/userPreferences/application/changePreferences/userPreferencesChanger";
import { LocalForageUserPreferencesRepository } from "@guitos/userPreferences/infrastructure/localForageUserPreferencesRepository";
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
