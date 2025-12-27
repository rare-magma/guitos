import type { UserPreferences } from "@guitos/contexts/userPreferences/domain/userPreferences";
import type { UserPreferencesRepository } from "@guitos/contexts/userPreferences/domain/userPreferencesRepository";
import type { Nullable } from "@shared/domain/nullable";
import type { Primitives } from "@shared/domain/primitives";
import { expect, vi } from "vitest";

export class UserPreferencesRepositoryMock
  implements UserPreferencesRepository
{
  private mockSave = vi.fn();
  private mockRead = vi.fn();

  async save(userPreferences: Primitives<UserPreferences>): Promise<void> {
    await this.mockSave(userPreferences);
  }

  assertSaveHasBeenCalledWith(userPreferences: UserPreferences): void {
    const { mock } = this.mockSave;
    const lastSavedExampleAggregate = mock.calls[mock.calls.length - 1][0];
    const expectedBody = userPreferences.toPrimitives();
    const lastSavedExampleAggregateBody = lastSavedExampleAggregate;

    // expect(lastSavedExampleAggregate).toBeInstanceOf(UserPreferences);
    expect(lastSavedExampleAggregateBody).toStrictEqual(expectedBody);
  }

  async read(): Promise<Nullable<Primitives<UserPreferences>>> {
    return await this.mockRead();
  }

  whenReadThenReturn(
    userPreferences: Nullable<Primitives<UserPreferences>>,
  ): void {
    this.mockRead.mockResolvedValue(userPreferences);
  }
}
