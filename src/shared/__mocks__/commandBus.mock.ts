import type { Command } from "@shared/domain/commandBus/command";
import type { CommandBus } from "@shared/domain/commandBus/commandBus";
import { ObjectMother } from "@shared/domain/objectMother.mother";
import { expect, vi } from "vitest";

export class CommandBusMock implements CommandBus {
  private mockDispatch = vi.fn();

  async dispatch(command: Command): Promise<void> {
    await this.mockDispatch(command);
  }

  whenDispatchThenThrow(error: Error): void {
    this.mockDispatch.mockRejectedValue(error);
  }

  whenDispatchThenThrowRandomly(error: Error): void {
    this.mockDispatch.mockImplementation(() => {
      const shouldFail = ObjectMother.coin();

      if (shouldFail) {
        return Promise.reject(error);
      }

      return Promise.resolve();
    });
  }

  assertLastDispatchedCommandIs(command: Command): void {
    expect(this.mockDispatch).toHaveBeenLastCalledWith(command);
  }

  assertDispatchedCommandsAre(commands: Command[]): void {
    const { mock } = this.mockDispatch;

    commands.forEach((command: Command, i: number) => {
      const commandCall = mock.calls[i][0];
      expect(commandCall).toStrictEqual(command);
    });
    expect(this.mockDispatch).toHaveBeenCalledTimes(commands.length);
  }

  assertNothingDispatched(): void {
    expect(this.mockDispatch).not.toHaveBeenCalled();
  }
}
