import { UserPreferencesQuery } from "@guitos/userPreferences/application/changePreferences/userPreferencesQuery";
import { UserPreferencesResponse } from "@guitos/userPreferences/application/changePreferences/userPreferencesResponse";
import type { Query } from "@shared/domain/queryBus/query";
import type { QueryHandler } from "@shared/domain/queryBus/queryHandler";
import type { Response } from "@shared/domain/queryBus/response";

export class UserPreferencesQueryHandler
  implements QueryHandler<Query, Response>
{
  subscribedTo(): UserPreferencesQuery {
    return UserPreferencesQuery;
  }

  handle(_query: UserPreferencesQuery): Promise<UserPreferencesResponse> {
    return Promise.resolve(new UserPreferencesResponse());
  }
}
