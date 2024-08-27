export default class Uuid {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
    this.ensureIsValidUuid(value);
  }

  toString(): string {
    return this.value;
  }

  static random(): Uuid {
    return new Uuid(crypto.randomUUID());
  }

  private ensureIsValidUuid(id: string): void {
    const uuidRegex =
      /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
    if (!uuidRegex.test(id)) {
      throw new Error(
        `<${this.constructor.name}> does not allow the value <${id}>`,
      );
    }
  }
}
