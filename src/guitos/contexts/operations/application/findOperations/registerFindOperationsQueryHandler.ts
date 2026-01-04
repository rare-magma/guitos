import { FindOperationsQueryHandler } from "@guitos/contexts/operations/application/findOperations/findOperationsQueryHandler";
import { OperationsFinder } from "@guitos/contexts/operations/application/findOperations/operationsFinder";
import { LocalForageOperationsRepository } from "@guitos/contexts/operations/infrastructure/localForageOperationsRepository";
import { queryBus } from "@shared/infrastructure/buses";

export function registerFindOperationsQueryHandler() {
  const queryHandler = new FindOperationsQueryHandler(
    new OperationsFinder(new LocalForageOperationsRepository()),
  );

  queryBus.register(queryHandler);
}
