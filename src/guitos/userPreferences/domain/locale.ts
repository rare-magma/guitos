import { InvalidArgument } from "@shared/domain/invalidArgument";
import { StringValueObject } from "@shared/domain/stringValueObject";
import { chromeLocalesList } from "src/lists/chromeLocalesList";
import { firefoxLocalesList } from "src/lists/firefoxLocalesList";

export class Locale extends StringValueObject {
  readonly locale: string;

  constructor(locale: string) {
    super(locale);

    this.locale = locale;

    this.ensureIsValidLocale(locale);
  }

  private ensureIsValidLocale(locale: string): void {
    if (
      !chromeLocalesList.includes(locale) ||
      !firefoxLocalesList.includes(locale)
    ) {
      throw new InvalidArgument(
        `<${this.constructor.name}> does not allow <${locale}>`,
      );
    }
  }
}
