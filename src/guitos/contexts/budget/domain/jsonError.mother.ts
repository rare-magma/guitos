import type { JsonError } from "@guitos/contexts/budget/domain/jsonError";

export class JsonErrorMother {
  static error(): JsonError {
    return {
      errors:
        "SyntaxError: Expected ',' or '}' after property amount in JSON at position 209",
      file: "123.json",
    };
  }
}
