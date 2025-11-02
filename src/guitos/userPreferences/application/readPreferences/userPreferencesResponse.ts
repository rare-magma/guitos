import type { Primitives } from "@shared/domain/primitives";
import { Response } from "@shared/domain/queryBus/response";

export class UserPreferencesResponse extends Response {
  readonly currency: string;
  readonly locale: string;

  constructor({ currency, locale }: Primitives<UserPreferencesResponse>) {
    super();

    this.currency = currency;
    this.locale = locale;
  }
}
