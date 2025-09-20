import { InvalidArgument } from "@shared/domain/invalidArgument";
import { StringValueObject } from "@shared/domain/stringValueObject";

export class Datetime extends StringValueObject {
  constructor(datetime?: string) {
    Datetime.ensureIsValidDate(datetime);

    super(new Date(datetime ?? Date.now()).toISOString());
  }

  private static ensureIsValidDate(value?: string): void {
    try {
      if (!value) {
        throw new InvalidArgument(
          `<${Datetime.name}> doesn't allow empty values`,
        );
      }
      new Date(value);
    } catch {
      throw new InvalidArgument(
        `<${Datetime.name}> doesn't allow the value <${value}>`,
      );
    }
  }

  add(seconds: number): Datetime {
    const date = new Date(this.value);
    date.setSeconds(date.getSeconds() + seconds);

    return new Datetime(date.toISOString());
  }
}
