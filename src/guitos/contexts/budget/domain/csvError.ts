import type { ParseError } from "papaparse";

export class CsvError {
  errors: ParseError[];
  file: string;

  constructor(errors: ParseError[], file: string) {
    this.errors = errors;
    this.file = file;
  }
}
