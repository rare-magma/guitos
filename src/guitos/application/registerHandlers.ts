import { registerFindOperationsQueryHandler } from "@guitos/operations/application/findOperations/registerFindOperationsQueryHandler";
import { registerPersistOperationsCommandHandler } from "@guitos/operations/application/persistOperations/registerPersistOperationsCommandHandler";
import { registerRemoveOperationsCommandHandler } from "@guitos/operations/application/removeOperations/registerRemoveOperationsCommandHandler";
import { registerChangeUserPreferencesCommandHandler } from "@guitos/userPreferences/application/changePreferences/registerChangeUserPreferencesCommandHandler";
import { registerReadUserPreferencesQueryHandler } from "@guitos/userPreferences/application/readPreferences/registerReadUserPreferencesQueryHandler";

export function registerHandlers() {
  // commands
  registerChangeUserPreferencesCommandHandler();
  registerPersistOperationsCommandHandler();
  registerRemoveOperationsCommandHandler();
  // events
  // queries
  registerReadUserPreferencesQueryHandler();
  registerFindOperationsQueryHandler();
}
