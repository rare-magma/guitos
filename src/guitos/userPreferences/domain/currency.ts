import { InvalidArgument } from "@shared/domain/invalidArgument";
import { StringValueObject } from "@shared/domain/stringValueObject";
import { currenciesList } from "../../../lists/currenciesList";

export class Currency extends StringValueObject {
  constructor(code: string) {
    super(code);

    this.ensureIsValidCode(code);
  }

  private ensureIsValidCode(code: string): void {
    if (!currenciesList.includes(code)) {
      throw new InvalidArgument(
        `<${this.constructor.name}> does not allow the code <${code}>`,
      );
    }
  }
}
