import { OperationsRemover } from "@guitos/operations/application/removeOperations/operationsRemover";
import { RemoveOperationsCommandMother } from "@guitos/operations/application/removeOperations/removeOperationsCommand.mother";
import { RemoveOperationsCommandHandler } from "@guitos/operations/application/removeOperations/removeOperationsCommandHandler";
import { OperationsRepositoryMock } from "@guitos/operations/domain/__mocks__/operationsRepository.mock";
import { ItemOperationMother } from "@guitos/operations/domain/itemOperation.mother";
import { ItemOperationDeletedDomainEventMother } from "@guitos/operations/domain/itemOperationDeletedDomainEvent.mother";
import { EventBusMock } from "@shared/__mocks__/eventBus.mock";
import { describe, expect, it } from "vitest";

describe("operationsRemover", () => {
  it("should remove ItemOperations", async () => {
    expect.hasAssertions();

    const repository = new OperationsRepositoryMock();
    const handler = new RemoveOperationsCommandHandler(
      new OperationsRemover(repository),
    );
    const command = RemoveOperationsCommandMother.random();

    await handler.handle(command);

    repository.assertDeleteHasBeenCalledWith(command.id);
  });

  // TODO: fix assertion in assertDeleteHasBeenCalledWith
  it.todo("should publish an ItemOperationDeletedDomainEvent", async () => {
    expect.hasAssertions();

    const eventBus = new EventBusMock();
    const repository = new OperationsRepositoryMock();
    const handler = new RemoveOperationsCommandHandler(
      new OperationsRemover(repository),
    );
    const existing = ItemOperationMother.random();
    const command = RemoveOperationsCommandMother.random();
    const expected =
      ItemOperationDeletedDomainEventMother.fromItemOperation(existing);

    await handler.handle(command);

    eventBus.assertLastPublishedEventIs(expected);
  });
});
