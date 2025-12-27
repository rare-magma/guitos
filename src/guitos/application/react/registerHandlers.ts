import { registerFindOperationsQueryHandler } from "@guitos/contexts/operations/application/findOperations/registerFindOperationsQueryHandler";
import { registerPersistOperationsCommandHandler } from "@guitos/contexts/operations/application/persistOperations/registerPersistOperationsCommandHandler";
import { registerRemoveOperationsCommandHandler } from "@guitos/contexts/operations/application/removeOperations/registerRemoveOperationsCommandHandler";
import { registerChangeUserPreferencesCommandHandler } from "@guitos/contexts/userPreferences/application/changePreferences/registerChangeUserPreferencesCommandHandler";
import { registerReadUserPreferencesQueryHandler } from "@guitos/contexts/userPreferences/application/readPreferences/registerReadUserPreferencesQueryHandler";

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
