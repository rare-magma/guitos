import type { Clock } from "@shared/domain/clock";
import type { Datetime } from "@shared/domain/datetime";
import { vi } from "vitest";

export class ClockMock implements Clock {
  private mockNow = vi.fn();

  now(): Datetime {
    return this.mockNow();
  }

  whenNowThenReturn(datetime: Datetime): void {
    this.mockNow.mockReturnValue(datetime);
  }
}
