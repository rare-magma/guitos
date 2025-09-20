import type { Datetime } from "@shared/domain/datetime";

export interface Clock {
  now(): Datetime;
}
