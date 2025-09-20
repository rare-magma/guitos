import type { CsvError } from "@guitos/domain/csvError";

export class CsvErrorMother {
  static error(): CsvError {
    return {
      errors: [
        {
          type: "FieldMismatch",
          code: "TooFewFields",
          message: "Line 0: Too few fields: expected 3 fields but parsed 2",
          row: 0,
        },
      ],
      file: "123.csv",
    };
  }
}
