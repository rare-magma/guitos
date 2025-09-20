import { CurrencyMother } from "@guitos/userPreferences/domain/currency.mother";
import { LocaleMother } from "@guitos/userPreferences/domain/locale.mother";
import { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
import { DatetimeMother } from "@shared/domain/datetime.mother";
import { ObjectMother } from "@shared/domain/objectMother.mother";
import type { Primitives } from "@shared/domain/primitives";

export class UserPreferencesMother {
  static create(primitives: Primitives<UserPreferences>): UserPreferences {
    return UserPreferences.fromPrimitives(primitives);
  }

  static default(): UserPreferences {
    return UserPreferences.create(
      CurrencyMother.default().value,
      LocaleMother.default().value,
      DatetimeMother.random(),
    );
  }

  static random(
    overwrites?: Partial<Primitives<UserPreferences>>,
  ): UserPreferences {
    const currency = ObjectMother.currencyCode();
    return UserPreferencesMother.create({
      currency,
      locale: LocaleMother.random().value,
      createdAt: DatetimeMother.random().value,
      ...overwrites,
    });
  }

  static invalid(): UserPreferences {
    const currency = ObjectMother.randomAlpha();
    return UserPreferencesMother.create({
      currency,
      locale: navigator.language,
      createdAt: DatetimeMother.random().value,
    });
  }

  static spanish(): UserPreferences {
    return UserPreferencesMother.create({
      currency: CurrencyMother.euro().value,
      locale: LocaleMother.spanish().value,
      createdAt: DatetimeMother.random().value,
    });
  }
}
