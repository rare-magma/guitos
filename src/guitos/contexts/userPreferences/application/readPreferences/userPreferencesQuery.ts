import { Query } from "@shared/domain/queryBus/query";

export class UserPreferencesQuery extends Query {
  static readonly name = "guitos.userpreferences.get.1";
  constructor() {
    super(UserPreferencesQuery.name);
  }
}
