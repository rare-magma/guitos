import { Currency } from "@guitos/userPreferences/domain/currency";
import { ObjectMother } from "@shared/domain/objectMother.mother";

export class CurrencyMother {
  static default(): Currency {
    return new Currency("USD");
  }

  static random(): Currency {
    const code = ObjectMother.currencyCode();
    return new Currency(code);
  }

  static invalid(): Currency {
    const code = ObjectMother.randomAlpha();
    return new Currency(code);
  }

  static euro(): Currency {
    return new Currency("EUR");
  }
}
