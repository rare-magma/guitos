import { InvalidArgument } from "@shared/domain/invalidArgument";
import { StringValueObject } from "@shared/domain/stringValueObject";
import { currenciesList } from "../../../infrastructure/lists/currenciesList";

export class Currency extends StringValueObject {
  static readonly default = "USD";

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
