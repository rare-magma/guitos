export class JsonError {
  errors: string;
  file: string;

  constructor(errors: string, file: string) {
    this.errors = errors;
    this.file = file;
  }
}
