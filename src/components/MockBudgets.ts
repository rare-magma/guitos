import { Budget } from "./Budget";
import { Expense } from "./Expense";
import { Income } from "./Income";
import { ItemForm } from "./ItemForm";
import { Stat } from "./Stat";

export const MOCK_BUDGETS = [
  new Budget({
    id: "c21f4e28-a4af-47c8-b017-189d7dfb724e",
    name: "2022-08",
    expenses: new Expense({
      items: [
        new ItemForm({
          id: 1,
          name: "rent",
          value: 700.12,
        }),
        new ItemForm({
          id: 2,
          name: "food",
          value: 300.03,
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
        new ItemForm({
          id: 19,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 20,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 21,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 22,
          name: "rent",
          value: 700,
        }),
        new ItemForm({
          id: 23,
          name: "food",
          value: 300,
        }),
        new ItemForm({
          id: 24,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 25,
          name: "electricity",
          value: 50,
        }),
        new ItemForm({
          id: 26,
          name: "electricity",
          value: 50,
        }),
      ],
      total: 1250,
    }),
    incomes: new Income({
      items: [
        new ItemForm({
          id: 1,
          name: "job1",
          value: 2000,
        }),
        new ItemForm({
          id: 2,
          name: "sales2",
          value: 300,
        }),
        new ItemForm({
          id: 3,
          name: "job3",
          value: 2000,
        }),
        new ItemForm({
          id: 4,
          name: "sales4",
          value: 300,
        }),
        new ItemForm({
          id: 5,
          name: "job5",
          value: 2000,
        }),
        new ItemForm({
          id: 6,
          name: "sales6",
          value: 300,
        }),
        new ItemForm({
          id: 7,
          name: "job7",
          value: 2000,
        }),
        new ItemForm({
          id: 8,
          name: "sales8",
          value: 300,
        }),
        new ItemForm({
          id: 9,
          name: "job9",
          value: 2000,
        }),
        new ItemForm({
          id: 10,
          name: "sales10",
          value: 300,
        }),
        new ItemForm({
          id: 11,
          name: "sales11",
          value: 300,
        }),
        new ItemForm({
          id: 12,
          name: "sales12",
          value: 300,
        }),
        new ItemForm({
          id: 13,
          name: "sales13",
          value: 300,
        }),
      ],
      total: 2000,
    }),
    stats: new Stat({
      available: 400,
      withGoal: 300,
      saved: 400,
      goal: 45,
      savings: 3000,
    }),
  }),
  new Budget({
    id: "1f1fc47f-9383-4b25-ab11-263e2be87304",
    name: "2022-09",
    expenses: new Expense({
      items: [
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
      items: [
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
      available: 400,
      withGoal: 300,
      saved: 400,
      goal: 45,
      savings: 3000,
    }),
  }),
  new Budget({
    id: "b92fb8d5-8537-4d43-b5f5-8e9371ce8a96",
    name: "2022-10",
    expenses: new Expense({
      items: [
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
      items: [
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
      available: 400,
      withGoal: 300,
      saved: 400,
      goal: 45,
      savings: 3000,
    }),
  }),
  new Budget({
    id: "7d48caa1-4a25-43d5-9593-309250547155",
    name: "2022-11",
    expenses: new Expense({
      items: [
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
      items: [
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
      available: 400,
      withGoal: 300,
      saved: 400,
      goal: 45,
      savings: 3000,
    }),
  }),
  new Budget({
    id: "9a457208-b29d-4108-a346-3995aea26efe",
    name: "2022-12",
    expenses: new Expense({
      items: [
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
      items: [
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
      available: 400,
      withGoal: 300,
      saved: 400,
      goal: 45,
      savings: 3000,
    }),
  }),
];
