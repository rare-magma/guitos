export abstract class Query {
  readonly queryName: string;

  constructor(queryName: string) {
    this.queryName = queryName;
  }
}
