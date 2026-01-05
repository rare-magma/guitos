import type { Budget } from "@guitos/contexts/budget/domain/budget";
import type { JsonBudgetRepository } from "@guitos/contexts/importExport/domain/jsonBudgetRepository";
import { JsonParseError } from "@guitos/contexts/importExport/domain/jsonParseError";
import type { Nullable } from "@shared/domain/nullable";
import type { Primitives } from "@shared/domain/primitives";

export type JsonImportResult = {
  success: boolean;
  data: Primitives<Budget[]>;
  errors: Nullable<JsonParseError>;
};

export class JsonParseBudgetRepository implements JsonBudgetRepository {
  import(json: string): JsonImportResult {
    try {
      const list = JSON.parse(json) as Primitives<Budget[]>;
      return {
        success: true,
        data: list,
        errors: null,
      };
    } catch (e) {
      return {
        success: false,
        data: [],
        errors: new JsonParseError((e as Error).message),
      };
    }
  }
}
