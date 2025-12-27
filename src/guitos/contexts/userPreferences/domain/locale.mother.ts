import { Locale } from "@guitos/contexts/userPreferences/domain/locale";
import { ObjectMother } from "@shared/domain/objectMother.mother";

export class LocaleMother {
  static default(): Locale {
    return new Locale(Locale.default);
  }

  static random(): Locale {
    const code = ObjectMother.locale();
    return new Locale(code);
  }

  static invalid(): Locale {
    const code = ObjectMother.randomAlpha();
    return new Locale(code);
  }

  static spanish(): Locale {
    return new Locale("es");
  }
}
