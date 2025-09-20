import type { Currency } from "@guitos/userPreferences/domain/currency";
import type { Locale } from "@guitos/userPreferences/domain/locale";
import { UserPreferences } from "@guitos/userPreferences/domain/userPreferences";
import type { UserPreferencesRepository } from "@guitos/userPreferences/domain/userPreferencesRepository";
import type { Nullable } from "@shared/domain/nullable";
import { expect, vi } from "vitest";

export class UserPreferencesRepositoryMock
  implements UserPreferencesRepository
{
  private mockSave = vi.fn();
  private mockRead = vi.fn();

  async save(userPreferences: UserPreferences): Promise<void> {
    await this.mockSave(userPreferences);
  }

  assertSaveHasBeenCalledWith(userPreferences: UserPreferences): void {
    const { mock } = this.mockSave;
    const lastSavedExampleAggregate = mock.calls[mock.calls.length - 1][0];
    const expectedBody = userPreferences.toPrimitives();
    const lastSavedExampleAggregateBody =
      lastSavedExampleAggregate.toPrimitives();

    expect(lastSavedExampleAggregate).toBeInstanceOf(UserPreferences);
    expect(lastSavedExampleAggregateBody).toStrictEqual(expectedBody);
  }

  async read(): Promise<Nullable<UserPreferences>> {
    return await this.mockRead();
  }

  whenReadThenReturn(userPreferences: Nullable<UserPreferences>): void {
    this.mockRead.mockResolvedValue(userPreferences);
  }

  getCurrencyCode(): Promise<Currency> {
    throw new Error("Method not implemented.");
  }
  saveCurrencyCode(_code: Currency): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getLocale(): Promise<string> {
    throw new Error("Method not implemented.");
  }
  saveLocale(_locale: Locale): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getUserLang(): string {
    throw new Error("Method not implemented.");
  }
  getCountryCode(_locale: string): string {
    throw new Error("Method not implemented.");
  }
  getDefaultCurrencyCode(): string {
    throw new Error("Method not implemented.");
  }
}
