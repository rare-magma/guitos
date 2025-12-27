import { Currency } from "@guitos/contexts/userPreferences/domain/currency";
import { Locale } from "@guitos/contexts/userPreferences/domain/locale";
import { UserPreferencesChangedDomainEvent } from "@guitos/contexts/userPreferences/domain/userPreferencesChangedDomainEvent";
import { currenciesMap } from "@guitos/contexts/userPreferences/infrastructure/lists/currenciesMap";
import { AggregateRoot } from "@shared/domain/aggregateRoot";
import { Datetime } from "@shared/domain/datetime";
import type { Primitives } from "@shared/domain/primitives";

export class UserPreferences extends AggregateRoot {
  readonly currency: Currency;
  readonly locale: Locale;

  readonly createdAt: Datetime;

  constructor(currency: Currency, locale: Locale, createdAt: Datetime) {
    super();

    this.currency = currency;
    this.locale = locale;

    this.createdAt = createdAt;
  }

  static create(
    currencyCode: string,
    locale: string,
    createdAt: Datetime,
  ): UserPreferences {
    const userPreferences = new UserPreferences(
      new Currency(currencyCode),
      new Locale(locale),
      createdAt,
    );

    userPreferences.record(
      new UserPreferencesChangedDomainEvent(userPreferences.toPrimitives()),
    );

    return userPreferences;
  }

  static default(createdAt: Datetime) {
    const locale = UserPreferences.getUserLang();
    const code = UserPreferences.getDefaultCurrencyCode();
    return new UserPreferences(
      new Currency(code),
      new Locale(locale),
      createdAt,
    );
  }

  static fromPrimitives({
    currency,
    locale,
    createdAt,
  }: Primitives<UserPreferences>): UserPreferences {
    return new UserPreferences(
      new Currency(currency),
      new Locale(locale),
      new Datetime(createdAt),
    );
  }

  toPrimitives(): Primitives<UserPreferences> {
    return {
      currency: this.currency.value,
      locale: this.locale.value,
      createdAt: this.createdAt.value,
    };
  }

  static getUserLang(): string {
    return navigator.language || Locale.default;
  }

  private static getCountryCode(locale: string): string {
    return locale.split("-").length >= 2
      ? locale.split("-")[1].toUpperCase()
      : locale.toUpperCase();
  }

  private static getCurrencyCodeFromCountry(country: string): string {
    const countryIsInMap =
      currenciesMap[country as keyof typeof currenciesMap] !== undefined;

    if (countryIsInMap) {
      return currenciesMap[
        country as keyof typeof currenciesMap
      ] as unknown as string;
    }
    return Currency.default;
  }

  private static getDefaultCurrencyCode(): string {
    const country = UserPreferences.getCountryCode(
      UserPreferences.getUserLang(),
    );
    return UserPreferences.getCurrencyCodeFromCountry(country);
  }
}
