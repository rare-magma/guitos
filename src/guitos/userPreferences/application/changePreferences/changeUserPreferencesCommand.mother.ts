import { ChangeUserPreferencesCommand } from "@guitos/userPreferences/application/changePreferences/changeUserPreferencesCommand";
import { CurrencyMother } from "@guitos/userPreferences/domain/currency.mother";
import { LocaleMother } from "@guitos/userPreferences/domain/locale.mother";
import type { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
import { UserPreferencesMother } from "@guitos/userPreferences/domain/userPreferences.mother";
import type { Datetime } from "@shared/domain/datetime";
import type { Primitives } from "@shared/domain/primitives";

export class ChangeUserPreferencesCommandMother {
  static create(
    params: Primitives<ChangeUserPreferencesCommand>,
  ): ChangeUserPreferencesCommand {
    return new ChangeUserPreferencesCommand(params);
  }

  static random(
    overwrites?: Partial<Primitives<ChangeUserPreferencesCommand>>,
  ): ChangeUserPreferencesCommand {
    return ChangeUserPreferencesCommandMother.create({
      currency: CurrencyMother.random().value,
      locale: LocaleMother.random().value,
      ...overwrites,
    });
  }

  static applyCommand(
    command: ChangeUserPreferencesCommand,
    context: { createdAt: Datetime },
  ): UserPreferences {
    return UserPreferencesMother.create({
      ...command,
      createdAt: context.createdAt.value,
    });
  }
}
