import type { RemoveOperationsCommand } from "@guitos/operations/application/removeOperations/removeOperationsCommand";
import type { OperationsRepository } from "@guitos/operations/domain/operationsRepository";

export class OperationsRemover {
  private readonly repository: OperationsRepository;

  constructor(repository: OperationsRepository) {
    this.repository = repository;
  }

  async run({ id }: RemoveOperationsCommand): Promise<void> {
    await this.repository.delete(id);
  }
}
