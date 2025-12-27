import { commandBus } from "@guitos/infrastructure/buses";
import { OperationsRemover } from "@guitos/operations/application/removeOperations/operationsRemover";
import { RemoveOperationsCommandHandler } from "@guitos/operations/application/removeOperations/removeOperationsCommandHandler";
import { LocalForageOperationsRepository } from "@guitos/operations/infrastructure/localForageOperationsRepository";

export function registerRemoveOperationsCommandHandler() {
  const changer = new OperationsRemover(new LocalForageOperationsRepository());
  const commandHandler = new RemoveOperationsCommandHandler(changer);

  commandBus.register(commandHandler);
}
