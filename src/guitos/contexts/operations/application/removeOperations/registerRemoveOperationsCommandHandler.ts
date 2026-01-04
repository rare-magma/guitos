import { OperationsRemover } from "@guitos/contexts/operations/application/removeOperations/operationsRemover";
import { RemoveOperationsCommandHandler } from "@guitos/contexts/operations/application/removeOperations/removeOperationsCommandHandler";
import { LocalForageOperationsRepository } from "@guitos/contexts/operations/infrastructure/localForageOperationsRepository";
import { commandBus } from "@shared/infrastructure/buses";

export function registerRemoveOperationsCommandHandler() {
  const changer = new OperationsRemover(new LocalForageOperationsRepository());
  const commandHandler = new RemoveOperationsCommandHandler(changer);

  commandBus.register(commandHandler);
}
