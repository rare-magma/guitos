import { Currency } from "@guitos/userPreferences/domain/currency";
import { Locale } from "@guitos/userPreferences/domain/locale";
import { UserPreferencesChangedDomainEvent } from "@guitos/userPreferences/domain/userPreferencesChangedDomainEvent";
import { AggregateRoot } from "@shared/domain/aggregateRoot";
import { Datetime } from "@shared/domain/datetime";
import type { Primitives } from "@shared/domain/primitives";

export class UserPreferences extends AggregateRoot {
  readonly currency: Currency;
  readonly locale: Locale;

  readonly createdAt: Datetime;

  private constructor(currency: Currency, locale: Locale, createdAt: Datetime) {
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
}
