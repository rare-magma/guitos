import { faker } from "@faker-js/faker";
import { UserOptions } from "./userOptions";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class UserOptionsMother {
  static default(): UserOptions {
    return new UserOptions("USD", navigator.language);
  }

  static random(): UserOptions {
    const currencyCode = faker.finance.currencyCode();
    return new UserOptions(currencyCode, navigator.language);
  }

  static invalid(): UserOptions {
    const currencyCode = faker.string.alpha();
    return new UserOptions(currencyCode, navigator.language);
  }

  static spanish(): UserOptions {
    return new UserOptions("EUR", "es-ES");
  }
}
