import { Locale } from "@guitos/userPreferences/domain/locale";
import { ObjectMother } from "@shared/domain/objectMother.mother";

export class LocaleMother {
  static default(): Locale {
    return new Locale("en-IE");
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
    return new Locale("es-ES");
  }
}
