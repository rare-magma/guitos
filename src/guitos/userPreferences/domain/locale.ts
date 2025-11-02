import { InvalidArgument } from "@shared/domain/invalidArgument";
import { StringValueObject } from "@shared/domain/stringValueObject";
import ISO6391 from "iso-639-1";

export class Locale extends StringValueObject {
  readonly locale: string;

  constructor(locale: string) {
    super(locale);

    this.locale = locale;

    this.ensureIsValidLocale(locale);
  }

  private ensureIsValidLocale(locale: string): void {
    const code = locale.split("-")[0];
    if (!ISO6391.validate(code)) {
      throw new InvalidArgument(
        `<${this.constructor.name}> does not allow <${locale}>`,
      );
    }
  }
}
