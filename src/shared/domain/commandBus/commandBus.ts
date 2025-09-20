import type { Command } from "@shared/domain/commandBus/command";

export interface CommandBus {
  dispatch(command: Command): Promise<void>;
}
