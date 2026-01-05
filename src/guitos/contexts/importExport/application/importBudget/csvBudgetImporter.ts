import { BudgetCalculator } from "@guitos/application/react/budgetCalculator";
import type { CsvRow } from "@guitos/application/react/budgetCsvService";
import { roundBig } from "@guitos/application/react/utils";
import { Budget } from "@guitos/contexts/budget/domain/budget";
import { BudgetItem } from "@guitos/contexts/budget/domain/budgetItem";
import type { ImportBudgetCsvCommand } from "@guitos/contexts/importExport/application/importBudget/importBudgetCsvCommand";
import { CsvBudgetImportFailedDomainEvent } from "@guitos/contexts/importExport/domain/csvBudgetImportFailedDomainEvent";
import type { CsvBudgetRepository } from "@guitos/contexts/importExport/domain/csvBudgetRepository";
import type { EventBus } from "@shared/domain/eventBus/eventBus";

export class CsvBudgetImporter {
  private readonly repository: CsvBudgetRepository;
  private readonly eventBus: EventBus;

  constructor(repository: CsvBudgetRepository, eventBus: EventBus) {
    this.repository = repository;
    this.eventBus = eventBus;
  }

  async run({ budgetName, csv }: ImportBudgetCsvCommand): Promise<void> {
    const budgetCsv = this.repository.import(csv);
    const newBudget = this.createBudgetFromCsv(budgetCsv.data, budgetName);
    await this.eventBus.publish(newBudget.pullDomainEvents());
    if (budgetCsv?.errors && budgetCsv.errors.length > 0) {
      await this.eventBus.publish(
        new CsvBudgetImportFailedDomainEvent({ errors: budgetCsv.errors }),
      );
    }
  }

  private createBudgetFromCsv(csv: CsvRow[], name: string): Budget {
    const newBudget = Budget.create(name.slice(0, -4));

    csv.forEach((item, key) => {
      const amount = item.amount ?? item.value; // handle deprecated value field
      const newBudgetItem = new BudgetItem({
        id: key,
        name: item.name,
        amount: Number(amount),
      });

      switch (item.type) {
        case "expense":
          newBudget.expenses.items.push(newBudgetItem);
          break;
        case "income":
          newBudget.incomes.items.push(newBudgetItem);
          break;
        case "goal":
          newBudget.stats.goal = Number(item.amount);
          break;
        case "reserves":
          newBudget.stats.reserves = Number(item.amount);
          break;
      }
    });

    newBudget.expenses.total = roundBig(
      BudgetCalculator.itemsTotal(newBudget.expenses.items),
      2,
    );
    newBudget.incomes.total = roundBig(
      BudgetCalculator.itemsTotal(newBudget.incomes.items),
      2,
    );
    newBudget.stats.available = roundBig(
      BudgetCalculator.available(newBudget),
      2,
    );
    newBudget.stats.withGoal = BudgetCalculator.availableWithGoal(newBudget);
    newBudget.stats.saved = BudgetCalculator.saved(newBudget);

    return Budget.update(newBudget);
  }
}
