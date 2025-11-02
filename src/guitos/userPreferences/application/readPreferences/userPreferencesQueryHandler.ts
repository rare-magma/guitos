import { UserPreferencesQuery } from "@guitos/userPreferences/application/readPreferences/userPreferencesQuery";
import type { UserPreferencesReader } from "@guitos/userPreferences/application/readPreferences/userPreferencesReader";
import { UserPreferencesResponse } from "@guitos/userPreferences/application/readPreferences/userPreferencesResponse";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";

export class UserPreferencesQueryHandler
  implements QueryHandler<UserPreferencesQuery, UserPreferencesResponse>
{
  private readonly reader: UserPreferencesReader;

  constructor(reader: UserPreferencesReader) {
    this.reader = reader;
  }

  subscribedTo(): UserPreferencesQuery {
    return UserPreferencesQuery;
  }

  async handle(query: UserPreferencesQuery): Promise<UserPreferencesResponse> {
    const preferences = await this.reader.run(query);
    return new UserPreferencesResponse(preferences);
  }
}
