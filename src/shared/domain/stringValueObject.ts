import { InvalidArgument } from "@shared/domain/invalidArgument";
import { ValueObject } from "@shared/domain/valueObject";

export abstract class StringValueObject extends ValueObject<string> {
  constructor(value: string) {
    const trimmed = value.trim();

    StringValueObject.ensureStringIsNotEmpty(trimmed);

    super(trimmed);
  }

  private static ensureStringIsNotEmpty(value: string): void {
    if (!value) {
      throw new InvalidArgument(
        `<${StringValueObject.name}> doesn't allow empty strings`,
      );
    }
  }
}
