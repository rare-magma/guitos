import type { JsonError } from "@guitos/domain/jsonError";

export class JsonErrorMother {
  static error(): JsonError {
    return {
      errors:
        "SyntaxError: Expected ',' or '}' after property value in JSON at position 209",
      file: "123.json",
    };
  }
}
