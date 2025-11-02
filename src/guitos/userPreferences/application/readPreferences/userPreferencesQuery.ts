import { Query } from "@shared/domain/queryBus/query";

export class UserPreferencesQuery extends Query {
  static queryName = "user-preferences.query";
  constructor() {
    super("user-preferences.query");
  }
}
