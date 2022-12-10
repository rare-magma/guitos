import { Budget } from "./Budget";
import { Expense } from "./Expense";
import { Income } from "./Income";
import { ItemForm } from "./ItemForm";
import { Stat } from "./Stat";

export const MOCK_BUDGETS = [
  new Budget({
    id: 1,
    name: "2022-08",
    expenses: new Expense({
      id: "2022-08-Expenses",
      expenses: [
        new ItemForm({
          id: 1,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 2,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 3,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 4,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 5,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 6,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 7,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 8,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 9,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 10,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 11,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 12,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 13,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 14,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 15,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 16,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 17,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 18,
          name: "electricity",
          value: 50,
        }),
      ],
      total: 1250,
    }),
    incomes: new Income({
      id: "2022-08-Incomes",
      incomes: [
        new ItemForm({
          id: 1,
          name: "job",
          value: 2000,
        }),
        new ItemForm({
          id: 2,
          name: "sales",
          value: 300,
        }),
      ],
      total: 2000,
    }),
    stats: new Stat({
      id: "2022-08-Stats",
      available: 400,
      withGoal: 300,
      saved: 400,
      goal: 45,
      savings: 3000,
    }),
  }),
  new Budget({
    id: 2,
    name: "2022-09",
    expenses: new Expense({
      id: "2022-09-Expenses",
      expenses: [
        new ItemForm({
          id: 1,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 2,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 3,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 4,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 5,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 6,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 7,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 8,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 9,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 10,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 11,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 12,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 13,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 14,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 15,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 16,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 17,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 18,
          name: "electricity",
          value: 50,
        }),
      ],
      total: 1250,
    }),
    incomes: new Income({
      id: "2022-09-Incomes",
      incomes: [
        new ItemForm({
          id: 1,
          name: "job",
          value: 2000,
        }),
        new ItemForm({
          id: 2,
          name: "sales",
          value: 300,
        }),
      ],
      total: 2000,
    }),
    stats: new Stat({
      id: "2022-09-Stats",
      available: 400,
      withGoal: 300,
      saved: 400,
      goal: 45,
      savings: 3000,
    }),
  }),
  new Budget({
    id: 3,
    name: "2022-10",
    expenses: new Expense({
      id: "2022-10-Expenses",
      expenses: [
        new ItemForm({
          id: 1,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 2,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 3,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 4,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 5,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 6,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 7,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 8,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 9,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 10,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 11,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 12,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 13,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 14,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 15,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 16,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 17,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 18,
          name: "electricity",
          value: 50,
        }),
      ],
      total: 1250,
    }),
    incomes: new Income({
      id: "2022-10-Incomes",
      incomes: [
        new ItemForm({
          id: 1,
          name: "job",
          value: 2000,
        }),
        new ItemForm({
          id: 2,
          name: "sales",
          value: 300,
        }),
      ],
      total: 2000,
    }),
    stats: new Stat({
      id: "2022-10-Stats",
      available: 400,
      withGoal: 300,
      saved: 400,
      goal: 45,
      savings: 3000,
    }),
  }),
  new Budget({
    id: 4,
    name: "2022-11",
    expenses: new Expense({
      id: "2022-11-Expenses",
      expenses: [
        new ItemForm({
          id: 1,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 2,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 3,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 4,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 5,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 6,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 7,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 8,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 9,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 10,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 11,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 12,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 13,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 14,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 15,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 16,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 17,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 18,
          name: "electricity",
          value: 50,
        }),
      ],
      total: 1250,
    }),
    incomes: new Income({
      id: "2022-11-Incomes",
      incomes: [
        new ItemForm({
          id: 1,
          name: "job",
          value: 2000,
        }),
        new ItemForm({
          id: 2,
          name: "sales",
          value: 300,
        }),
      ],
      total: 2000,
    }),
    stats: new Stat({
      id: "2022-11-Stats",
      available: 400,
      withGoal: 300,
      saved: 400,
      goal: 45,
      savings: 3000,
    }),
  }),
  new Budget({
    id: 5,
    name: "2022-12",
    expenses: new Expense({
      id: "2022-12-Expenses",
      expenses: [
        new ItemForm({
          id: 1,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 2,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 3,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 4,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 5,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 6,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 7,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 8,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 9,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 10,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 11,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 12,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 13,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 14,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 15,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 16,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 17,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 18,
          name: "electricity",
          value: 50,
        }),
      ],
      total: 1250,
    }),
    incomes: new Income({
      id: "2022-12-Incomes",
      incomes: [
        new ItemForm({
          id: 1,
          name: "job",
          value: 2000,
        }),
        new ItemForm({
          id: 2,
          name: "sales",
          value: 300,
        }),
      ],
      total: 2000,
    }),
    stats: new Stat({
      id: "2022-12-Stats",
      available: 400,
      withGoal: 300,
      saved: 400,
      goal: 45,
      savings: 3000,
    }),
  }),
];
