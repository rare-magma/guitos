import { ChangeUserPreferencesCommand } from "@guitos/contexts/userPreferences/application/changePreferences/changeUserPreferencesCommand";
import type { UserPreferencesChanger } from "@guitos/contexts/userPreferences/application/changePreferences/userPreferencesChanger";
import type { Command } from "@shared/domain/commandBus/command";
import type { CommandHandler } from "@shared/domain/commandBus/commandHandler";

export class ChangeUserPreferencesCommandHandler
  implements CommandHandler<ChangeUserPreferencesCommand>
{
  private creator: UserPreferencesChanger;

  constructor(creator: UserPreferencesChanger) {
    this.creator = creator;
  }

  subscribedTo(): Command {
    return ChangeUserPreferencesCommand;
  }

  async handle(command: ChangeUserPreferencesCommand): Promise<void> {
    await this.creator.run(command);
  }
}
