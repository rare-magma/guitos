import { InvalidArgument } from "@shared/domain/invalidArgument";

const uuidRegex =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;

export class Uuid {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
    this.ensureIsValidUuid(value);
  }

  toString(): string {
    return this.value;
  }

  static random(): Uuid {
    if (!window.isSecureContext) {
      throw new Error(
        "<crypto.randomUUID()> is not available in a non-secure context",
      );
    }
    return new Uuid(crypto.randomUUID());
  }

  private ensureIsValidUuid(id: string): void {
    if (!uuidRegex.test(id)) {
      throw new InvalidArgument(
        `<${this.constructor.name}> does not allow the value <${id}>`,
      );
    }
    if (!window.isSecureContext) {
      throw new Error(
        `<${this.constructor.name}> is not available in a non-secure context`,
      );
    }
  }
}
