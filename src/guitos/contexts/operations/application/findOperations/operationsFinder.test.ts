import { FindOperationsQuery } from "@guitos/contexts/operations/application/findOperations/findOperationsQuery";
import { FindOperationsQueryHandler } from "@guitos/contexts/operations/application/findOperations/findOperationsQueryHandler";
import { FindOperationsResponse } from "@guitos/contexts/operations/application/findOperations/findOperationsResponse";
import { OperationsFinder } from "@guitos/contexts/operations/application/findOperations/operationsFinder";
import { OperationsRepositoryMock } from "@guitos/contexts/operations/domain/__mocks__/operationsRepository.mock";
import { ItemOperationMother } from "@guitos/contexts/operations/domain/itemOperation.mother";
import { ObjectMother } from "@shared/domain/objectMother.mother";
import { describe, expect, it } from "vitest";

describe("operationsFinder", () => {
  it("should return no operation when there's none saved", async () => {
    expect.hasAssertions();

    const repository = new OperationsRepositoryMock();
    const handler = new FindOperationsQueryHandler(
      new OperationsFinder(repository),
    );
    const query = new FindOperationsQuery(ObjectMother.uuid().value);
    const expected = new FindOperationsResponse({ operations: [] });

    repository.whenGetThenReturn(null);

    const actual = await handler.handle(query);

    expect(actual).toStrictEqual(expected);
  });

  it("should return existing Operations", async () => {
    expect.hasAssertions();

    const repository = new OperationsRepositoryMock();
    const handler = new FindOperationsQueryHandler(
      new OperationsFinder(repository),
    );
    const query = new FindOperationsQuery(ObjectMother.uuid().value);
    const itemOperations = ItemOperationMother.random();
    const expected = new FindOperationsResponse({
      operations: [itemOperations.toPrimitives()],
    });

    repository.whenGetThenReturn([itemOperations.toPrimitives()]);
    repository.update(itemOperations.id, [itemOperations.toPrimitives()]);

    const actual = await handler.handle(query);

    expect(actual).toStrictEqual(expected);
  });
});
