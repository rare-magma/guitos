import { commandBus, eventBus, queryBus } from "@guitos/infrastructure/buses";
import { OperationsPersister } from "@guitos/operations/application/persistOperations/operationsPersister";
import { PersistOperationsCommandHandler } from "@guitos/operations/application/persistOperations/persistOperationsCommandHandler";
import { LocalForageOperationsRepository } from "@guitos/operations/infrastructure/localForageOperationsRepository";
import { CurrentTimeClock } from "@shared/infrastructure/currentTimeClock";

export function registerPersistOperationsCommandHandler() {
  const changer = new OperationsPersister(
    new CurrentTimeClock(),
    new LocalForageOperationsRepository(),
    eventBus,
    queryBus,
  );
  const commandHandler = new PersistOperationsCommandHandler(changer);

  commandBus.register(commandHandler);
}
