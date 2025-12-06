export abstract class Query {
  readonly name: string;
  constructor(name: string) {
    this.name = name;
  }
}
