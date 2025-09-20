import { Command } from "@shared/domain/commandBus/command";
import type { Primitives } from "@shared/domain/primitives";

export class ChangeUserPreferencesCommand extends Command {
  readonly currency: string;
  readonly locale: string;

  constructor({ currency, locale }: Primitives<ChangeUserPreferencesCommand>) {
    super();

    this.currency = currency;
    this.locale = locale;
  }
}
