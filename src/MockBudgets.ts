import { Budget } from "./Budget";

export const MOCK_BUDGETS = [
  new Budget({
    id: 1,
    name: "2022-08",
    expenses: [
      {
        name: "rent",
        value: 700,
      },
      {
        name: "food",
        value: 200,
      },
      {
        name: "electricity",
        value: 50,
      },
    ],
    incomes: [
      {
        name: "job",
        value: 2000,
      },
      {
        name: "sales",
        value: 300,
      },
    ],
    total: 1230,
  }),
  new Budget({
    id: 2,
    name: "2022-09",
    expenses: {
      rent: 700,
      food: 300,
      electricity: 50,
    },
    incomes: {
      job: 2000,
      sales: 300,
    },
    total: 2500,
  }),
  new Budget({
    id: 3,
    name: "2022-10",
    expenses: {
      rent: 700,
      food: 300,
      electricity: 50,
    },
    incomes: {
      job: 2000,
      sales: 300,
    },
    total: 900,
  }),
  new Budget({
    id: 4,
    name: "2022-11",
    expenses: {
      rent: 700,
      food: 300,
      electricity: 50,
    },
    incomes: {
      job: 2000,
      sales: 300,
    },
    total: 1250,
  }),
  new Budget({
    id: 5,
    name: "2022-12",
    expenses: {
      rent: 700,
      food: 300,
      electricity: 50,
    },
    incomes: {
      job: 2000,
      sales: 300,
    },
    total: 350,
  }),
];
