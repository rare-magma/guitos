export abstract class Command {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }
}
