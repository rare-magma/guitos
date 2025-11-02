import { Command } from "@shared/domain/commandBus/command";

export class ChangeUserPreferencesCommand extends Command {
  static commandName = "user-preferences.command";
  readonly currency: string;
  readonly locale: string;

  constructor({ currency, locale }: { currency: string; locale: string }) {
    super("user-preferences.command");

    this.currency = currency;
    this.locale = locale;
  }
}
