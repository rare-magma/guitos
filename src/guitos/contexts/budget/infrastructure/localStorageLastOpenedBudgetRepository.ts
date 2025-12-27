import type { LastOpenedBudgetRepository } from "@guitos/contexts/budget/domain/lastOpenedBudgetRepository";

export class LocalStorageLastOpenedBudgetRepository
  implements LastOpenedBudgetRepository
{
  find(): string {
    try {
      const budget = localStorage.getItem("guitos_lastOpenedBudget");
      if (!budget) throw new Error();
      return budget;
    } catch (e) {
      throw new Error((e as Error).message);
    }
  }

  save(name: string): boolean {
    try {
      localStorage.setItem("guitos_lastOpenedBudget", name);
      return true;
    } catch {
      return false;
    }
  }
}
