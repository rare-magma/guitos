import { UserOptions } from "@guitos/domain/userOptions";
import { ObjectMother } from "@shared/domain/objectMother.mother";

export class UserOptionsMother {
  static default(): UserOptions {
    return new UserOptions("USD", navigator.language);
  }

  static random(): UserOptions {
    const currencyCode = ObjectMother.currencyCode();
    return new UserOptions(currencyCode, navigator.language);
  }

  static invalid(): UserOptions {
    const currencyCode = ObjectMother.randomAlpha();
    return new UserOptions(currencyCode, navigator.language);
  }

  static spanish(): UserOptions {
    return new UserOptions("EUR", "es-ES");
  }
}
