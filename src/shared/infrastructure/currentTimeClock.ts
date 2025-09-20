import type { Clock } from "@shared/domain/clock";
import { Datetime } from "@shared/domain/datetime";

export class CurrentTimeClock implements Clock {
  now(): Datetime {
    return new Datetime();
  }
}
