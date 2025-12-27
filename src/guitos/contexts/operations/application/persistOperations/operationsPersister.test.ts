import { FindOperationsResponseMother } from "@guitos/contexts/operations/application/findOperations/findOperationsResponse.mother";
import { OperationsPersister } from "@guitos/contexts/operations/application/persistOperations/operationsPersister";
import { PersistOperationsCommandMother } from "@guitos/contexts/operations/application/persistOperations/persistOperationsCommand.mother";
import { PersistOperationsCommandHandler } from "@guitos/contexts/operations/application/persistOperations/persistOperationsCommandHandler";
import { OperationsRepositoryMock } from "@guitos/contexts/operations/domain/__mocks__/operationsRepository.mock";
import { ItemOperation } from "@guitos/contexts/operations/domain/itemOperation";
import { ItemOperationCreatedDomainEventMother } from "@guitos/contexts/operations/domain/itemOperationCreatedDomainEvent.mother";
import { ClockMock } from "@shared/__mocks__/clock.mock";
import { EventBusMock } from "@shared/__mocks__/eventBus.mock";
import { QueryBusMock } from "@shared/__mocks__/queryBus.mock";
import { describe, expect, it } from "vitest";

describe("operationsPersister", () => {
  it("should save ItemOperations", async () => {
    expect.hasAssertions();

    const clock = new ClockMock();
    const repository = new OperationsRepositoryMock();
    const eventBus = new EventBusMock();
    const queryBus = new QueryBusMock();
    const handler = new PersistOperationsCommandHandler(
      new OperationsPersister(clock, repository, eventBus, queryBus),
    );
    const command = PersistOperationsCommandMother.random();
    const expected = PersistOperationsCommandMother.applyCommand(command);
    queryBus.whenAskThenReturn(FindOperationsResponseMother.empty());

    await handler.handle(command);

    repository.assertUpdateHasBeenCalledWith(expected);
  });

  // TODO: fix assertion in assertUpdateHasBeenCalledWith
  it.todo(
    "should save existing ItemOperations and the new ItemOperations",
    async () => {
      expect.hasAssertions();

      const clock = new ClockMock();
      const repository = new OperationsRepositoryMock();
      const eventBus = new EventBusMock();
      const queryBus = new QueryBusMock();
      const handler = new PersistOperationsCommandHandler(
        new OperationsPersister(clock, repository, eventBus, queryBus),
      );
      const command = PersistOperationsCommandMother.random();
      const response = FindOperationsResponseMother.random();
      const existing = [
        ItemOperation.create(
          response.operations[0].id,
          response.operations[0].budgetItemId,
          response.operations[0].changeValue,
          response.operations[0].mathOperation,
          response.operations[0].createdAt ?? "",
        ),
      ];
      const expected = [
        ...PersistOperationsCommandMother.applyCommand(command),
        ...existing,
      ];
      queryBus.whenAskThenReturn(response);

      await handler.handle(command);

      repository.assertUpdateHasBeenCalledWith(expected);
    },
  );

  // TODO: fix assertion in assertUpdateHasBeenCalledWith
  it.todo("should publish an ItemOperationCreatedDomainEvent", async () => {
    expect.hasAssertions();

    const clock = new ClockMock();
    const repository = new OperationsRepositoryMock();
    const eventBus = new EventBusMock();
    const queryBus = new QueryBusMock();
    const handler = new PersistOperationsCommandHandler(
      new OperationsPersister(clock, repository, eventBus, queryBus),
    );
    const command = PersistOperationsCommandMother.random();
    const expected = ItemOperationCreatedDomainEventMother.fromItemOperation(
      PersistOperationsCommandMother.applyCommand(command)[0],
    );
    queryBus.whenAskThenReturn(FindOperationsResponseMother.empty());

    await handler.handle(command);

    eventBus.assertLastPublishedEventIs(expected);
  });
});
