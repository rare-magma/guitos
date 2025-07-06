import { ObjectMother } from "./objectMother.mother";
import { UserOptions } from "./userOptions";

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
