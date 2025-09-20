import { UserPreferencesRepositoryMock } from "@guitos/__mocks__/userPreferencesRepository.mock";
import { ChangeUserPreferencesCommandMother } from "@guitos/userPreferences/application/changePreferences/changeUserPreferencesCommand.mother";
import { ChangeUserPreferencesCommandHandler } from "@guitos/userPreferences/application/changePreferences/changeUserPreferencesCommandHandler";
import { UserPreferencesChanger } from "@guitos/userPreferences/application/changePreferences/userPreferencesChanger";
import { UserPreferencesChangedDomainEventMother } from "@guitos/userPreferences/domain/userPreferencesChangedDomainEvent.mother";
import { ClockMock } from "@shared/__mocks__/clock.mock";
import { EventBusMock } from "@shared/__mocks__/eventBus.mock";
import { DatetimeMother } from "@shared/domain/datetime.mother";
import { describe, expect, it } from "vitest";

describe("userPreferencesChanger", () => {
  it("should create valid UserPreferences", async () => {
    expect.hasAssertions();

    const clock = new ClockMock();
    const repository = new UserPreferencesRepositoryMock();
    const eventBus = new EventBusMock();
    const handler = new ChangeUserPreferencesCommandHandler(
      new UserPreferencesChanger(clock, repository, eventBus),
    );
    const command = ChangeUserPreferencesCommandMother.random();
    const createdAt = DatetimeMother.random();
    const expected = ChangeUserPreferencesCommandMother.applyCommand(command, {
      createdAt,
    });

    clock.whenNowThenReturn(createdAt);
    repository.whenReadThenReturn(null);

    await handler.handle(command);

    repository.assertSaveHasBeenCalledWith(expected);
  });

  it("should publish an UserPreferencesChangedDomainEvent", async () => {
    expect.hasAssertions();

    const clock = new ClockMock();
    const repository = new UserPreferencesRepositoryMock();
    const eventBus = new EventBusMock();
    const handler = new ChangeUserPreferencesCommandHandler(
      new UserPreferencesChanger(clock, repository, eventBus),
    );
    const command = ChangeUserPreferencesCommandMother.random();
    const createdAt = DatetimeMother.random();
    const expected =
      UserPreferencesChangedDomainEventMother.fromUserPreferences(
        ChangeUserPreferencesCommandMother.applyCommand(command, {
          createdAt,
        }),
      );

    clock.whenNowThenReturn(createdAt);
    repository.whenReadThenReturn(null);

    await handler.handle(command);

    eventBus.assertLastPublishedEventIs(expected);
  });
});
