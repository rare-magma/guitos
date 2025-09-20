import { ValueObject } from "@shared/domain/valueObject";

export abstract class NumberValueObject extends ValueObject<number> {
  isBiggerThan(other: NumberValueObject): boolean {
    return this.value > other.value;
  }
  isSmallerThan(other: NumberValueObject): boolean {
    return this.value < other.value;
  }
  isEqualTo(other: NumberValueObject): boolean {
    return this.value === other.value;
  }
}
