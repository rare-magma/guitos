import { UserPreferencesQuery } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesQuery";
import { UserPreferencesQueryHandler } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesQueryHandler";
import { UserPreferencesReader } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesReader";
import { UserPreferencesResponseMother } from "@guitos/contexts/userPreferences/application/readPreferences/userPreferencesResponse.mother";
import { UserPreferencesRepositoryMock } from "@guitos/contexts/userPreferences/domain/__mocks__/userPreferencesRepository.mock";
import { UserPreferencesMother } from "@guitos/contexts/userPreferences/domain/userPreferences.mother";
import { ClockMock } from "@shared/__mocks__/clock.mock";
import { DatetimeMother } from "@shared/domain/datetime.mother";
import { describe, expect, it } from "vitest";

describe("userPreferencesReader", () => {
  it("should return default UserPreferences when there's none saved", async () => {
    expect.hasAssertions();

    const clock = new ClockMock();
    const repository = new UserPreferencesRepositoryMock();
    const handler = new UserPreferencesQueryHandler(
      new UserPreferencesReader(clock, repository),
    );
    const query = new UserPreferencesQuery();
    const createdAt = DatetimeMother.random();
    const expected = UserPreferencesResponseMother.default();

    clock.whenNowThenReturn(createdAt);
    repository.whenReadThenReturn(null);

    const actual = await handler.handle(query);

    expect(actual).toStrictEqual(expected);
  });

  it("should return existing UserPreferences", async () => {
    expect.hasAssertions();

    const clock = new ClockMock();
    const repository = new UserPreferencesRepositoryMock();
    const handler = new UserPreferencesQueryHandler(
      new UserPreferencesReader(clock, repository),
    );
    const query = new UserPreferencesQuery();
    const createdAt = DatetimeMother.random();
    const userPreferences = UserPreferencesMother.random();
    const expected = UserPreferencesResponseMother.create(
      userPreferences.toPrimitives(),
    );

    clock.whenNowThenReturn(createdAt);
    repository.save(userPreferences.toPrimitives());
    repository.whenReadThenReturn(userPreferences.toPrimitives());

    const actual = await handler.handle(query);

    expect(actual).toStrictEqual(expected);
  });
});
