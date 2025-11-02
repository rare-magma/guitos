import { UserPreferencesRepositoryMock } from "@guitos/__mocks__/userPreferencesRepository.mock";
import { UserPreferencesQuery } from "@guitos/userPreferences/application/readPreferences/userPreferencesQuery";
import { UserPreferencesQueryHandler } from "@guitos/userPreferences/application/readPreferences/userPreferencesQueryHandler";
import { UserPreferencesReader } from "@guitos/userPreferences/application/readPreferences/userPreferencesReader";
import { UserPreferencesMother } from "@guitos/userPreferences/domain/userPreferences.mother";
import { UserPreferencesChangedDomainEventMother } from "@guitos/userPreferences/domain/userPreferencesChangedDomainEvent.mother";
import { ClockMock } from "@shared/__mocks__/clock.mock";
import { EventBusMock } from "@shared/__mocks__/eventBus.mock";
import { DatetimeMother } from "@shared/domain/datetime.mother";
import { describe, expect, it } from "vitest";

describe("userPreferencesReader", () => {
  it("should return UserPreferences when there's none saved", async () => {
    expect.hasAssertions();

    const clock = new ClockMock();
    const repository = new UserPreferencesRepositoryMock();
    const eventBus = new EventBusMock();
    const handler = new UserPreferencesQueryHandler(
      new UserPreferencesReader(clock, repository, eventBus),
    );
    const query = new UserPreferencesQuery();
    const createdAt = DatetimeMother.random();
    const expected = UserPreferencesMother.random();

    clock.whenNowThenReturn(createdAt);
    repository.whenReadThenReturn(null);

    const actual = await handler.handle(query);

    expect(actual).toEqual(expected);
  });

  it("should return existing UserPreferences", async () => {
    expect.hasAssertions();

    const clock = new ClockMock();
    const repository = new UserPreferencesRepositoryMock();
    const eventBus = new EventBusMock();
    const handler = new UserPreferencesQueryHandler(
      new UserPreferencesReader(clock, repository, eventBus),
    );
    const query = new UserPreferencesQuery();
    const createdAt = DatetimeMother.random();
    const expected = UserPreferencesMother.random();

    clock.whenNowThenReturn(createdAt);
    repository.whenReadThenReturn(expected);
    repository.save(expected);

    const actual = await handler.handle(query);

    expect(actual).toEqual(expected);
  });

  it("should publish an UserPreferencesChangedDomainEvent", async () => {
    expect.hasAssertions();

    const clock = new ClockMock();
    const repository = new UserPreferencesRepositoryMock();
    const eventBus = new EventBusMock();
    const handler = new UserPreferencesQueryHandler(
      new UserPreferencesReader(clock, repository, eventBus),
    );
    const query = new UserPreferencesQuery();
    const createdAt = DatetimeMother.random();
    const random = UserPreferencesMother.random();
    const expected =
      UserPreferencesChangedDomainEventMother.fromUserPreferences(random);

    clock.whenNowThenReturn(createdAt);
    repository.whenReadThenReturn(random);

    await handler.handle(query);

    eventBus.assertLastPublishedEventIs(expected);
  });
});
