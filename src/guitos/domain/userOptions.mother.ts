import { UserOptions } from "./userOptions";
import { ObjectMother } from "./objectMother.mother";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
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
