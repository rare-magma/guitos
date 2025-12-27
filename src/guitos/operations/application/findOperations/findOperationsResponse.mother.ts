import { FindOperationsResponse } from "@guitos/operations/application/findOperations/findOperationsResponse";
import { ItemOperationMother } from "@guitos/operations/domain/itemOperation.mother";
import type { Primitives } from "@shared/domain/primitives";

export class FindOperationsResponseMother {
  static create(
    primitives: Primitives<FindOperationsResponse>,
  ): FindOperationsResponse {
    return new FindOperationsResponse(primitives);
  }

  static random(): FindOperationsResponse {
    const itemOperations = [ItemOperationMother.random().toPrimitives()];
    return FindOperationsResponseMother.create({
      operations: itemOperations,
    });
  }

  static empty(): FindOperationsResponse {
    return FindOperationsResponseMother.create({
      operations: [],
    });
  }
}
