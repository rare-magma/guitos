import { registerChangeUserPreferencesCommandHandler } from "@guitos/userPreferences/application/changePreferences/registerChangeUserPreferencesCommandHandler";
import { registerReadUserPreferencesQueryHandler } from "@guitos/userPreferences/application/readPreferences/registerReadUserPreferencesQueryHandler";

export function registerHandlers() {
  // commands
  registerChangeUserPreferencesCommandHandler();
  // events
  // queries
  registerReadUserPreferencesQueryHandler();
}
