import { Command } from "@shared/domain/commandBus/command";

export class ChangeUserPreferencesCommand extends Command {
  static readonly name = "guitos.userpreferences.change.1";
  readonly currency: string;
  readonly locale: string;

  constructor({ currency, locale }: { currency: string; locale: string }) {
    super(ChangeUserPreferencesCommand.name);

    this.currency = currency;
    this.locale = locale;
  }
}
