import { queryBus } from "@guitos/infrastructure/buses";
import { FindOperationsQueryHandler } from "@guitos/operations/application/findOperations/findOperationsQueryHandler";
import { OperationsFinder } from "@guitos/operations/application/findOperations/operationsFinder";
import { LocalForageOperationsRepository } from "@guitos/operations/infrastructure/localForageOperationsRepository";

export function registerFindOperationsQueryHandler() {
  const queryHandler = new FindOperationsQueryHandler(
    new OperationsFinder(new LocalForageOperationsRepository()),
  );

  queryBus.register(queryHandler);
}
