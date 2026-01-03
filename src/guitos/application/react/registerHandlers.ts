import { registerFindLastOpenedBudgetQueryHandler } from "@guitos/contexts/budget/application/findLastOpenedBudget/registerFindLastOpenedBudgetQueryHandler";
import { registerImportBudgetCsvCommandHandler } from "@guitos/contexts/budget/application/importBudget/registerImportBudgetCsvCommandHandler";
import { registerPersistBudgetCommandHandler } from "@guitos/contexts/budget/application/persistBudget/registerPersistBudgetCommandHandler";
import { registerPersistOnBudgetChangedSubscriber } from "@guitos/contexts/budget/application/persistBudget/registerPersistOnBudgetChangedSubscriber";
import { registerFindBudgetQueryHandler } from "@guitos/contexts/budget/application/readBudget/registerFindBudgetQueryHandler";
import { registerPersistLastOpenedBudgetCommandHandler } from "@guitos/contexts/budget/application/saveLastOpenedBudget/registerPersistLastOpenedBudgetCommandHandler";
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
  registerPersistLastOpenedBudgetCommandHandler();
  registerImportBudgetCsvCommandHandler();
  registerPersistBudgetCommandHandler();
  // events
  registerPersistOnBudgetChangedSubscriber();
  // queries
  registerReadUserPreferencesQueryHandler();
  registerFindOperationsQueryHandler();
  registerFindLastOpenedBudgetQueryHandler();
  registerFindBudgetQueryHandler();
}
