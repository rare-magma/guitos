import { Datetime } from "@shared/domain/datetime";
import { ObjectMother } from "@shared/domain/objectMother.mother";

export class DatetimeMother {
  static create(datetime?: string): Datetime {
    return new Datetime(datetime);
  }

  static random(): Datetime {
    const date = ObjectMother.recentDate();

    return DatetimeMother.create(date.toISOString());
  }
}
